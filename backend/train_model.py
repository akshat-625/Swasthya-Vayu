# train_model.py
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from joblib import dump

# We'll create synthetic training data:
# features: [aqi, pm2_5, temp, age, has_asthma(0/1)]
# labels: 0 = Safe, 1 = Wear Mask, 2 = Stay Indoors

rng = np.random.RandomState(42)
n = 2000

aqi = rng.randint(10, 400, size=n)
pm25 = rng.randint(5, 200, size=n)
temp = rng.randint(5, 45, size=n)
age = rng.randint(1, 90, size=n)
asthma = rng.randint(0, 2, size=n)

X = np.vstack([aqi, pm25, temp, age, asthma]).T

y = []
for a, p, t, ag, ast in X:
    # Basic rule-based label (so model learns sensible rules)
    if a > 300 or p > 150:
        y.append(2)  # Stay Indoors
    elif (a > 150 or p > 75) and (ag > 60 or ast == 1):
        y.append(2)
    elif a > 100 or p > 50:
        y.append(1)  # Wear Mask
    else:
        y.append(0)  # Safe

y = np.array(y)

clf = DecisionTreeClassifier(max_depth=6, random_state=42)
clf.fit(X, y)

dump(clf, "model.joblib")
print("model.joblib saved (DecisionTree).")
