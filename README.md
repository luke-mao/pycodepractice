# PyCodePractice: A Leetcode-like Online Python Code Practice Platform

![Frontend Vite ReactJS](https://img.shields.io/badge/Frontend-Vite_ReactJS-ff69b4.svg)
![Backend Python Flask Restx](https://img.shields.io/badge/Backend-Flask_RESTX-red.svg)
![Docker](https://img.shields.io/badge/Containerized-Docker-informational.svg)

## Introduction

PyCodePractice is a full-stack, LeetCode-style online Python coding platform designed for learning, practice, and performance analysis.

The platform allows users to solve coding challenges through a browser-based editor, submit code, receive feedback on time and memory usage, and compare their submissions through a public leaderboard. Each submission is executed securely in a sandboxed Docker container with enforced time and memory limits.

To support learning, PyCodePractice includes an integrated AI tutor powered by OpenAI’s GPT-4o mini model. The tutor guides users through step-by-step hints without giving away full solutions, encouraging logical thinking and independent problem solving.

Admins can create, test, and upload new coding problems using a structured offline template workflow. The backend features analytics for monitoring user activity, submission trends, and per-problem execution statistics. All core services — code execution, forum, user management, and AI messaging — are containerized using Docker and orchestrated via Docker Compose.

## Website Features

Admin:
* login, logout
* create, update, delete problems
* deactivate / activate user accounts
* see analytics on the submission, AI tutor usage, and time and memory usage of each problem
* view & edit admin profile

User:
* login, logout, register
* view problems, submit solutions
* view submission ranking
* view all submissions
* post comments on problem forums
* talk to AI tutor (gpt-4o mini model)
* view & edit profile
* view submission frequency plots

## Local Setup

1. Git clone or download the code zip from [Github Link](https://github.com/luke-mao/pycodepractice)

2. Open `Docker Desktop`. 

3. Run docker compose in the root folder. 

    ```bash
    # build a python:3.10-slim-time image with the time module, this is for the backend sandbox
    docker build -t python:3.10-slim-time ./backend/examples/sandbox

    # build the frontend under the development mode
    cd frontend
    npm install
    npm run build:dev

    # go back to the root folder
    cd ..

    # run the docker compose
    docker-compose up --build --force-recreate
    ```

4. Create the `.env` file with the `OPENAI_API_KEY` variable in the `backend` folder. This key is used to access the OpenAI `GPT-4o-mini` model. You can get the key from the OpenAI API platform. 

    ```bash
    # open a terminal and go to the backend folder
    cd backend
    echo "OPENAI_API_KEY=your_openai_api_key" > .env
    ```

    This `.env` file is excluded from the git tracking. So you need to create it manually. 

    **Note**: In order to use the github actions, you also need to create a repository secret called `OPENAI_API_KEY` in the repo settings. You can do this by going to the repo settings -> secrets and variables -> actions -> new repository secret. The same api key can be used for both local and github actions.

4. Check the `Docker Desktop`, wait until 2 services are up. 

    Then open the browser and go to [http://localhost:3000](http://localhost:3000).

5. Some existing user accounts:

    | Username | Email | Password | Role |
    |----------|-------|----------| ---- |
    | Admin | Admin@mail.com | Abcd1234! | Admin |
    | Tom | Tom@mail.com | Abcd1234! | User |
    | Alice | Alice@mail.com | Abcd1234! | User |
    | John | John@mail.com | Abcd1234! | User |
    | Emily | Emily@mail.com | Abcd1234! | User |

The folder [./materials](./materials) has provided 2 sets of new challenge materials. The admin can upload the materials. 

## Development Setup

1. Git clone the repository to local: `https://github.com/luke-mao/pycodepractice.git`

2. At the root folder, open a terminal and install the dependencies for the commitlint and husky. These are for the commit message hook and linting.

    ```bash
    npm install
    npx husky
    ```

3. Open `Docker Desktop` and make sure it is running during the development. The backend start file will also check whether the `Docker` is running. 

4. Go to the backend folder, and install the dependencies. The backend will be running on [http://localhost:9000](http://localhost:9000). And hte backend docs is available at [http://localhost:9000/docs](http://localhost:9000/docs).

    ```bash
    cd backend
    
    docker build -t python:3.10-slim-time sandbox-example

    pip install -r requirements.txt
    python app.py

    # if using mac
    pip3 install -r requirements.txt
    python3 app.py
    ```

5. Go to the frontend folder, and install the dependencies for the frontend. By using `npm run dev`, the frontend will be running on [http://localhost:3000](http://localhost:3000).

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

**Keep the two terminals running to keep the backend and frontend running.**

## Testing

Tests have been written for the backend. Please follow the instructions in [backend/README.md](./backend/README.md#running-tests) of the section `Running Tests` to run the tests. Please ensure that you reset the database before and after running the tests. 

## Code Execution Sandbox

The frontend sends the user's code submission to the backend for execution. We will first perform a **syntax check** and a **function signature check** before storing and executing the code.

Our platform includes a **secure sandbox environment** to execute user-submitted code in an **isolated Docker container**. This ensures controlled execution, prevents security risks, and limits resource usage.

### How the User Submission Check & Sandbox Works

Example in [backend/sandbox-example folder](./backend/sandbox-example/)

1. **Syntax Check**

    Before executing the user submission, the system checks whether the submitted code is syntactically valid using Python’s built-in compile() function.

    This prevents immediate syntax errors from being executed inside the sandbox.

    If compilation fails, the system rejects the submission and provides the user with a detailed syntax error message.

2. **Function Signature Check**

    To ensure users follow the required function name and parameter structure, the system extracts function definitions using Python’s ast module.

    The submitted function is compared against the problem’s submission template to verify:
    * The correct function name is implemented.
    * The correct number and names of parameters are used.

    And the additional helper function written by the user will not affected the check. 

3. **User Submission (Stored in Database)**
    
    When a user submits code, it is stored in **raw text format** inside the database.

4. **Generating the Execution Files**
    
    Before execution, the system **writes the user’s code** into a Python file called **`user_submission.py`**.
    
    Each problem has an associated **test case file (`testcase.py`)**, prepared by the admin when creating the problem.
    
    The `testcase.py` file **imports the user's function**, renaming it to `user_submission()` so that `run.py` can execute it generically.

5. **Running the Test Cases** - `run.py`:

    Runs each test case.

    Enforces a **5-second execution time limit** using Python’s `signal` library.

    Captures **pass, fail, or timeout** results and prints them to `stdout`.

6. **Pre-built `python:3.10-slim-time` Docker Image for Sandbox Execution**
    
    Instead of installing dependencies (like `/usr/bin/time`) every time the sandbox runs, we use a **pre-built custom Docker image** called **`python:3.10-slim-time`**.
    
    The image is built **before** running the backend service and is used to execute all sandbox containers.
    
    This ensures faster execution and avoids unnecessary package installations inside every new container.
    
    To build the `python:3.10-slim-time` image, run:
      ```bash
      docker build -t python:3.10-slim-time ./backend/sandbox-example
      ```
    
    Once built, this image is used for all sandbox executions.

7. **Sandbox Execution in Docker** - `sandbox.py`:
    
    Creates a **temporary folder** using the Python's `tempfile` library.
    
    Copies `user_submission.py`, `testcase.py`, and `run.py` into the folder.
    
    Mounts this folder inside a **Docker container** running `python:3.10-slim`.
    
    Executes `run.py` inside Docker and captures `stdout` and `stderr`. Also use the `time` module and `memory.usage_in_bytes` to monitor the resource usage. The full command is:
      ```bash
      sh -c '/usr/bin/time -p python3 run.py && echo memory $(cat /sys/fs/cgroup/memory/memory.usage_in_bytes)'
      ```
    
    When the container finishes, all the logs are extracted and use python `re` module to extract the case results, real time, and memory usage.  
    
    Once execution finishes, the **Docker container is removed**, ensuring a clean and secure environment.
     
8. **Backend Integration**
   
   The backend server runs inside a **Docker container**.
   
   To allow sandbox execution inside Docker, the **backend container is granted access to the host’s Docker engine** using:
     ```yml
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
     ```
   
   This ensures the backend can **spawn and control sandbox containers** without requiring full Docker-in-Docker (DinD).

**Why Use a Pre-built `python3:10-slim-time` Image?**

The pre built imsage is ~192MB. It is built upon the python:3.10-slim image, which is a lightweight Python image. The `time` module is not in that image, so we need to install it.

| Feature | Detail |
|---------|--------|
| Faster Execution | Eliminates the need to install `/usr/bin/time` inside each new container. |
| Optimized Performance | Reduces unnecessary package installations, keeping the container small. |
| Reproducibility | Ensures all sandbox containers run with a **consistent** Python environment. |
| Security & Isolation | Prevents modifications inside the sandbox from affecting the backend. |

**Why Use a Docker-Based Sandbox?**

| Feature | Detail |
|---------|--------|
| Security | Prevents malicious code from affecting the host system. |
| Isolation | Each submission runs in a **clean, temporary environment**. |
| Resource Control | Limits execution **time (5s), memory (1GB), and CPU usage (1 core)**. |
| Automatic Cleanup | Containers are **deleted after execution** to free resources. |
