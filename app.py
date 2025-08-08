from flask import Flask, render_template, request, jsonify
from transformers import pipeline
import os

app = Flask(__name__)

MODEL_NAME = os.environ.get("SUM_MODEL", "facebook/bart-large-cnn")

print("Loading summarization model (this can take a while)...")
summarizer = pipeline("summarization", model=MODEL_NAME)
print("Model loaded")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text", "").strip()
    max_length = int(data.get("max_length", 130))
    min_length = int(data.get("min_length", 30))

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        summary_list = summarizer(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
        )
        summary = summary_list[0]["summary_text"]
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
