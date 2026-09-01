import pickle
from sklearn.ensemble import RandomForestClassifier

class RecordLinkingModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced"
        )

    def train(self, X, y):
        self.model.fit(X, y)

    def predict_probability(self, features):
        probability = self.model.predict_proba([features])[0][1]
        return float(probability)

    def save(self, path):
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)

    def load(self, path):
        with open(path, 'rb') as f:
            self.model = pickle.load(f)
