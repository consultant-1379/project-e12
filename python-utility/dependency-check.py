import mysql.connector
from flask import Flask, request, jsonify
import subprocess
import os
import json

app = Flask(__name__)

def insert_json_into_database(project_name, json_data):
    conn = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="password",
        database="dependency_check_report"
    )

    cursor = conn.cursor()

    insert_query = "Insert into dependency_check_results (project_name, vulnerabilities) VALUES (%s, %s)"
    cursor.execute(insert_query, (project_name, json_data))

    conn.commit()
    conn.close()

def run_dependency_check(project_name, repository_location):
    command = [
        "docker", "run", "--rm",
        "-v", f"{repository_location}:/project",
        "dependency-check",
        "--scan", "/project",
        "--format", "JSON"
    ]

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode == 0:
        json_data = result.stdout
        insert_json_into_database(project_name, json_data)
        return json_data
    else:
        error_message = result.stderr
        return error_message

@app.route('/run-dependency-check', methods=['POST'])
def run_dependency_check_api():
    data = request.json

    # Extract project_name and repository_location from the JSON data
    project_name = data.get('project_name')
    repository_location = data.get('repository_location')

    # Call the run_dependency_check function with the provided data
    json_data = run_dependency_check(project_name, repository_location)

    try:
        parsed_json = json.loads(json_data)
        return jsonify(parsed_json)
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to parse JSON: {str(e)}"})

# Start the Flask application, listening on all network interfaces at port 5000
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
