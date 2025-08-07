from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://krish:Admin123@mycluster.ycgzz7n.mongodb.net/?retryWrites=true&w=majority&appName=mycluster"
client = MongoClient(MONGO_URI)
db = client['logindata']
users_collection = db['employee']  # Collection where credentials are stored

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    role = data.get('role')
    employee_id = data.get('employeeId')
    password = data.get('password')

    user = users_collection.find_one({
        "role": role,
        "employeeId": employee_id,
        "password": password  # In production, use hashed passwords!
    })

    if user:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/api/employees', methods=['GET'])
def get_employees():
    employees = list(users_collection.find({}, {'_id': 0, 'employeeId': 1, 'role': 1}))
    return jsonify({'employees': employees})

@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.json
    role = data.get('role')
    employee_id = data.get('employeeId')
    password = data.get('password')

    if not role or not employee_id or not password:
        return jsonify({'success': False, 'message': 'All fields required'}), 400

    if users_collection.find_one({'employeeId': employee_id}):
        return jsonify({'success': False, 'message': 'Employee ID already exists'}), 400

    users_collection.insert_one({
        'role': role,
        'employeeId': employee_id,
        'password': password
    })
    return jsonify({'success': True, 'message': 'Employee added'})

@app.route('/')
def home():
    return "Welcome to the Flask Backend!"

if __name__ == '__main__':
    app.run(debug=True)