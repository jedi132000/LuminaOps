"""
AutoML Service for LuminaOps
Automated Machine Learning with multiple frameworks
"""

from typing import Dict, Any, List, Optional, Tuple, Union
import pandas as pd
import numpy as np
from dataclasses import dataclass
from enum import Enum
import asyncio
import json
import joblib
from pathlib import Path

try:
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, f1_score, mean_squared_error, r2_score
    import optuna
    from flaml import AutoML
    import xgboost as xgb
    import lightgbm as lgb
    from catboost import CatBoostClassifier, CatBoostRegressor
except ImportError as e:
    print(f"Warning: AutoML libraries not installed: {e}")

class ProblemType(Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    TIME_SERIES = "time_series"

class ModelType(Enum):
    FLAML = "flaml"
    XGBOOST = "xgboost"
    LIGHTGBM = "lightgbm"
    CATBOOST = "catboost"
    NEURAL_NETWORK = "neural_network"

@dataclass
class AutoMLConfig:
    problem_type: ProblemType
    model_type: ModelType = ModelType.FLAML
    time_budget: int = 300  # seconds
    metric: Optional[str] = None
    test_size: float = 0.2
    random_state: int = 42
    n_trials: int = 100  # for optuna
    early_stopping: bool = True

@dataclass
class ModelResult:
    model: Any
    score: float
    metrics: Dict[str, float]
    feature_importance: Dict[str, float]
    model_path: str
    config: Dict[str, Any]

class AutoMLService:
    """Automated Machine Learning Service"""
    
    def __init__(self):
        self.models = {}
        self.results = {}
        self.model_dir = Path("./data/models")
        self.model_dir.mkdir(parents=True, exist_ok=True)
    
    async def train_automl(
        self,
        data: pd.DataFrame,
        target_column: str,
        config: AutoMLConfig,
        model_id: Optional[str] = None
    ) -> ModelResult:
        """Train an AutoML model"""
        
        model_id = model_id or f"automl_{len(self.models)}"
        
        try:
            # Prepare data
            X = data.drop(columns=[target_column])
            y = data[target_column]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=config.test_size, random_state=config.random_state
            )
            
            # Train model based on type
            if config.model_type == ModelType.FLAML:
                result = await self._train_flaml(X_train, y_train, X_test, y_test, config)
            elif config.model_type == ModelType.XGBOOST:
                result = await self._train_xgboost(X_train, y_train, X_test, y_test, config)
            elif config.model_type == ModelType.LIGHTGBM:
                result = await self._train_lightgbm(X_train, y_train, X_test, y_test, config)
            elif config.model_type == ModelType.CATBOOST:
                result = await self._train_catboost(X_train, y_train, X_test, y_test, config)
            else:
                raise ValueError(f"Unsupported model type: {config.model_type}")
            
            # Save model
            model_path = self.model_dir / f"{model_id}.joblib"
            joblib.dump(result.model, model_path)
            result.model_path = str(model_path)
            
            # Store result
            self.models[model_id] = result.model
            self.results[model_id] = result
            
            return result
            
        except Exception as e:
            raise ValueError(f"AutoML training failed: {str(e)}")
    
    async def _train_flaml(self, X_train, y_train, X_test, y_test, config: AutoMLConfig) -> ModelResult:
        """Train using FLAML AutoML"""
        
        automl = AutoML()
        
        # Determine task type and metric
        task = "classification" if config.problem_type == ProblemType.CLASSIFICATION else "regression"
        metric = config.metric or ("accuracy" if task == "classification" else "r2")
        
        # Train model
        await asyncio.to_thread(
            automl.fit,
            X_train, y_train,
            task=task,
            metric=metric,
            time_budget=config.time_budget,
            early_stop=config.early_stopping
        )
        
        # Predict and evaluate
        y_pred = automl.predict(X_test)
        
        # Calculate metrics
        if config.problem_type == ProblemType.CLASSIFICATION:
            accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')
            metrics = {"accuracy": accuracy, "f1_score": f1}
            score = accuracy
        else:
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            metrics = {"mse": mse, "r2": r2}
            score = r2
        
        # Feature importance
        feature_importance = {}
        if hasattr(automl.model, 'feature_importances_'):
            feature_names = X_train.columns.tolist()
            importances = automl.model.feature_importances_
            feature_importance = dict(zip(feature_names, importances))
        
        return ModelResult(
            model=automl,
            score=score,
            metrics=metrics,
            feature_importance=feature_importance,
            model_path="",
            config={"algorithm": automl.best_estimator, "params": automl.best_config}
        )
    
    async def _train_xgboost(self, X_train, y_train, X_test, y_test, config: AutoMLConfig) -> ModelResult:
        """Train using XGBoost with hyperparameter optimization"""
        
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.8, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.8, 1.0),
                'random_state': config.random_state
            }
            
            if config.problem_type == ProblemType.CLASSIFICATION:
                model = xgb.XGBClassifier(**params)
            else:
                model = xgb.XGBRegressor(**params)
            
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            if config.problem_type == ProblemType.CLASSIFICATION:
                return accuracy_score(y_test, y_pred)
            else:
                return r2_score(y_test, y_pred)
        
        # Optimize hyperparameters
        study = optuna.create_study(direction='maximize')
        await asyncio.to_thread(study.optimize, objective, n_trials=config.n_trials)
        
        # Train best model
        best_params = study.best_params
        best_params['random_state'] = config.random_state
        
        if config.problem_type == ProblemType.CLASSIFICATION:
            model = xgb.XGBClassifier(**best_params)
        else:
            model = xgb.XGBRegressor(**best_params)
        
        await asyncio.to_thread(model.fit, X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        if config.problem_type == ProblemType.CLASSIFICATION:
            accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')
            metrics = {"accuracy": accuracy, "f1_score": f1}
            score = accuracy
        else:
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            metrics = {"mse": mse, "r2": r2}
            score = r2
        
        # Feature importance
        feature_names = X_train.columns.tolist()
        importances = model.feature_importances_
        feature_importance = dict(zip(feature_names, importances))
        
        return ModelResult(
            model=model,
            score=score,
            metrics=metrics,
            feature_importance=feature_importance,
            model_path="",
            config={"algorithm": "XGBoost", "params": best_params}
        )
    
    async def _train_lightgbm(self, X_train, y_train, X_test, y_test, config: AutoMLConfig) -> ModelResult:
        """Train using LightGBM with hyperparameter optimization"""
        
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'num_leaves': trial.suggest_int('num_leaves', 10, 300),
                'subsample': trial.suggest_float('subsample', 0.8, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.8, 1.0),
                'random_state': config.random_state,
                'verbose': -1
            }
            
            if config.problem_type == ProblemType.CLASSIFICATION:
                model = lgb.LGBMClassifier(**params)
            else:
                model = lgb.LGBMRegressor(**params)
            
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            if config.problem_type == ProblemType.CLASSIFICATION:
                return accuracy_score(y_test, y_pred)
            else:
                return r2_score(y_test, y_pred)
        
        # Optimize hyperparameters
        study = optuna.create_study(direction='maximize')
        await asyncio.to_thread(study.optimize, objective, n_trials=config.n_trials)
        
        # Train best model
        best_params = study.best_params
        best_params['random_state'] = config.random_state
        best_params['verbose'] = -1
        
        if config.problem_type == ProblemType.CLASSIFICATION:
            model = lgb.LGBMClassifier(**best_params)
        else:
            model = lgb.LGBMRegressor(**best_params)
        
        await asyncio.to_thread(model.fit, X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        if config.problem_type == ProblemType.CLASSIFICATION:
            accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')
            metrics = {"accuracy": accuracy, "f1_score": f1}
            score = accuracy
        else:
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            metrics = {"mse": mse, "r2": r2}
            score = r2
        
        # Feature importance
        feature_names = X_train.columns.tolist()
        importances = model.feature_importances_
        feature_importance = dict(zip(feature_names, importances))
        
        return ModelResult(
            model=model,
            score=score,
            metrics=metrics,
            feature_importance=feature_importance,
            model_path="",
            config={"algorithm": "LightGBM", "params": best_params}
        )
    
    async def _train_catboost(self, X_train, y_train, X_test, y_test, config: AutoMLConfig) -> ModelResult:
        """Train using CatBoost with hyperparameter optimization"""
        
        def objective(trial):
            params = {
                'iterations': trial.suggest_int('iterations', 100, 1000),
                'depth': trial.suggest_int('depth', 4, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'l2_leaf_reg': trial.suggest_float('l2_leaf_reg', 1, 10),
                'border_count': trial.suggest_int('border_count', 32, 255),
                'random_state': config.random_state,
                'verbose': False
            }
            
            if config.problem_type == ProblemType.CLASSIFICATION:
                model = CatBoostClassifier(**params)
            else:
                model = CatBoostRegressor(**params)
            
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            if config.problem_type == ProblemType.CLASSIFICATION:
                return accuracy_score(y_test, y_pred)
            else:
                return r2_score(y_test, y_pred)
        
        # Optimize hyperparameters
        study = optuna.create_study(direction='maximize')
        await asyncio.to_thread(study.optimize, objective, n_trials=config.n_trials)
        
        # Train best model
        best_params = study.best_params
        best_params['random_state'] = config.random_state
        best_params['verbose'] = False
        
        if config.problem_type == ProblemType.CLASSIFICATION:
            model = CatBoostClassifier(**best_params)
        else:
            model = CatBoostRegressor(**best_params)
        
        await asyncio.to_thread(model.fit, X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        if config.problem_type == ProblemType.CLASSIFICATION:
            accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')
            metrics = {"accuracy": accuracy, "f1_score": f1}
            score = accuracy
        else:
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            metrics = {"mse": mse, "r2": r2}
            score = r2
        
        # Feature importance
        feature_names = X_train.columns.tolist()
        importances = model.feature_importances_
        feature_importance = dict(zip(feature_names, importances))
        
        return ModelResult(
            model=model,
            score=score,
            metrics=metrics,
            feature_importance=feature_importance,
            model_path="",
            config={"algorithm": "CatBoost", "params": best_params}
        )
    
    async def predict(self, model_id: str, data: pd.DataFrame) -> np.ndarray:
        """Make predictions using trained model"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
        
        model = self.models[model_id]
        return await asyncio.to_thread(model.predict, data)
    
    async def get_model_info(self, model_id: str) -> Dict[str, Any]:
        """Get information about a trained model"""
        if model_id not in self.results:
            raise ValueError(f"Model {model_id} not found")
        
        result = self.results[model_id]
        return {
            "model_id": model_id,
            "score": result.score,
            "metrics": result.metrics,
            "feature_importance": result.feature_importance,
            "config": result.config,
            "model_path": result.model_path
        }
    
    async def load_model(self, model_path: str, model_id: str) -> bool:
        """Load a saved model"""
        try:
            model = joblib.load(model_path)
            self.models[model_id] = model
            return True
        except Exception as e:
            print(f"Failed to load model: {e}")
            return False

# Global service instance
automl_service = AutoMLService()