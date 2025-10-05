# LuminaOps Sample Datasets

This directory contains sample datasets for testing and experimentation with the LuminaOps platform.

## Available Datasets

### 1. dummy.csv (Comprehensive Customer Dataset)
**Purpose**: Full-featured dataset for comprehensive ML experimentation and testing
**Records**: 50 customers
**Use Cases**: Customer churn prediction, purchase amount regression, classification tasks

**Features**:
- **Demographics**: age, gender, education_level, location
- **Professional**: job_category, years_experience, income
- **Behavioral**: website_visits, email_opens, social_media_engagement
- **Transactional**: purchase_amount, purchase_date, product_category
- **Metrics**: satisfaction_score, credit_score, customer_lifetime_value, marketing_spend
- **Target**: churn (0 = retained, 1 = churned)

**Data Types**:
- Numerical: age, income, purchase_amount, satisfaction_score, credit_score, etc.
- Categorical: gender, education_level, job_category, location, product_category
- Date: purchase_date
- Binary: churn (target variable)

### 2. sample.csv (Simplified Dataset)  
**Purpose**: Quick testing and prototyping
**Records**: 20 customers
**Use Cases**: Rapid model testing, algorithm comparison, feature selection

**Features**:
- **id**: Customer identifier
- **age**: Customer age (25-55)
- **income**: Annual income ($46K-$95K)  
- **purchase_amount**: Last purchase amount ($280-$2250)
- **satisfaction_score**: Customer satisfaction (3.2-4.9)
- **churn**: Target variable (0 = retained, 1 = churned)

## ML Experiment Ideas

### Classification Tasks
1. **Customer Churn Prediction**
   - Target: `churn` column
   - Features: All other columns except `id`
   - Algorithms: Random Forest, XGBoost, Neural Networks
   - Metrics: Accuracy, Precision, Recall, F1-Score, AUC-ROC

2. **Product Category Prediction**
   - Target: `product_category` (dummy.csv only)
   - Features: Demographics and behavioral data
   - Type: Multi-class classification

### Regression Tasks  
1. **Purchase Amount Prediction**
   - Target: `purchase_amount`
   - Features: Demographics, income, satisfaction_score
   - Metrics: MAE, MSE, RMSE, R²

2. **Customer Lifetime Value Prediction**
   - Target: `customer_lifetime_value` (dummy.csv only)
   - Features: All transactional and behavioral features
   - Type: Continuous regression

### Clustering & Segmentation
1. **Customer Segmentation**
   - Features: Demographics, behavioral patterns, spending habits
   - Algorithms: K-Means, Hierarchical Clustering
   - Goal: Identify customer segments for targeted marketing

### Feature Engineering Examples
1. **Age Groups**: Binning age into categories (Young, Middle-aged, Senior)
2. **Income Brackets**: Creating income tiers (Low, Medium, High)
3. **Engagement Score**: Combining website_visits + email_opens + social_media_engagement
4. **Purchase Frequency**: Calculating purchases per time period
5. **Satisfaction Categories**: Converting satisfaction_score to Low/Medium/High

## Data Quality Notes

### Realistic Patterns
- **Income vs Purchase Amount**: Positive correlation with some variance
- **Age vs Credit Score**: Generally positive correlation  
- **Satisfaction vs Churn**: Lower satisfaction correlates with higher churn probability
- **Experience vs Income**: More experienced professionals tend to have higher incomes

### Missing Data Simulation
- No missing values in current datasets
- For testing ML pipelines with missing data, consider randomly removing 5-10% of values

### Data Distribution
- **Churn Rate**: ~10% (realistic for most businesses)
- **Age Distribution**: Normal distribution centered around 35-40
- **Income Distribution**: Right-skewed (more lower-income customers)
- **Satisfaction**: Slightly right-skewed (most customers satisfied)

## Usage in LuminaOps

### AutoML Training
1. Upload `dummy.csv` or `sample.csv` to the AutoML interface
2. Select target column (`churn` for classification, `purchase_amount` for regression)
3. Choose algorithms: Random Forest, XGBoost, Neural Networks
4. Configure hyperparameter optimization
5. Compare model performance and select best model

### AI Assistant Integration
- Ask the AI Assistant to analyze dataset characteristics
- Get feature engineering suggestions
- Request code for data preprocessing and visualization
- Generate model training scripts and evaluation metrics

### Monitoring Dashboard
- Use predicted vs actual values to populate model performance metrics
- Simulate model drift by modifying feature distributions over time
- Test alert systems with artificially degraded model performance

## Extension Ideas

### Additional Datasets
1. **Time Series Data**: Stock prices, sensor readings, web traffic
2. **Text Data**: Customer reviews, support tickets, product descriptions  
3. **Image Data**: Product images, customer photos, quality control images
4. **Graph Data**: Social networks, recommendation systems, fraud detection

### Synthetic Data Generation
- Use libraries like `faker` to generate larger datasets
- Create seasonal patterns for time-series experiments
- Add noise and outliers for robustness testing
- Implement data drift scenarios for model monitoring

## Data Privacy & Ethics
- All data is synthetic and does not represent real individuals
- Generated using realistic distributions and correlations
- Safe for experimentation, testing, and demonstration purposes
- No personal or sensitive information included

---

**Note**: These datasets are designed for development and testing purposes. For production use, ensure compliance with data privacy regulations and implement appropriate data governance practices.