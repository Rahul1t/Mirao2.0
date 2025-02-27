import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Set up DeepSeek API key
DEEPSEEK_API_KEY = os.getenv("sk-c0a4d039a4eb45459609a5dae1169eaa")  # Load API key from .env
DEEPSEEK_API_URL = "https://chat.deepseek.com/a/chat/"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": "Please enter a valid message."})

    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": user_message}
            ]
        }

        response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)

        # Check if the API request was successful
        if response.status_code == 200:
            return jsonify(response.json())  # Send the response to the frontend
        else:
            return jsonify({"response": f"API Error: {response.status_code}, {response.text}"})

    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
