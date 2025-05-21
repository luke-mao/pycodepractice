# Backend Guide

This guide provides instructions to set up and run the backend service, perform code validation checks, and execute the sandbox environment.

## Running the Backend

1. Install Dependencies
    Ensure you are inside the `backend` folder:
    ```bash
    cd backend
    ```

2. Install the required dependencies:
    ```bash
    pip install -r requirements.txt

    # for mac
    pip3 install -r requirements.txt
    ```

3. Build the Pre-Built Docker Image

    Before running the backend, we need to build a custom `python:3.10-slim-time` image, which includes the `/usr/bin/time` module required for execution time measurement.

    ```bash
    # Open the docker desktop first
    docker build -t python:3.10-slim-time ./examples/sandbox
    ```

    > **Why is this needed?** The default `python:3.10-slim` image does not include the `time` module.

4. Create the `.env` file with the `OPENAI_API_KEY` variable. This key is used to access the OpenAI `GPT-4o-mini` model. You can get the key from the OpenAI API platform. 

    ```bash
    # in the backend folder, open a terminal
    echo "OPENAI_API_KEY=your_openai_api_key" > .env
    ```

    This `.env` file is excluded from the git tracking. So you need to create it manually. 

5. Run the Backend Server

    Once dependencies are installed, start the backend:
    ```bash
    python app.py --debug

    # for mac
    python3 app.py --debug
    ```

    The `--debug` flag enables debug mode. And if for production model, you can run the backend without this flag. 

    The backend runs at: [http://localhost:9000](http://localhost:9000)

    And the API Docs are available at: [http://localhost:9000/docs](http://localhost:9000/docs)

## Reset Database

Resetting the database is necessary when you want to clear the database and start fresh (for example after some code development).

There are 3 database files in the `backend` folder:

| File Name | Description |
| ---------- | ----------- |
| `database.db` | The main database file used by the backend. |
| `utils/default.db` | A default database file with sample data. |
| `tests/test.db` | A test database file used for backend testing. |

We provide a `default.db` file in the `backend/utils` folder. So you can use this file to reset the database in the easy way. 

```bash
# in the backend folder, open a terminal
# copy the test/default.db file to the backend folder
cp utils/default.db database.db

# also reset for the tests/test.db file for backend testing
cp utils/default.db tests/test.db
```

We also provide a script `init_database.py` to programmatically reset the database file `database.db` and insert the sample data. The script will reset the user table, etc, first, then insert some submission records by making actual API calls to the backend server. That's the reason why you need to start the backend server first.

1. Open the `Docker Desktop` software. 
2. Make sure you have build the `python:3.10-slim-time` image so that the submission routes will work properly.

    ```bash
    # in the backend folder, open a terminal
    docker build -t python:3.10-slim-time ./examples/sandbox
    ```
3.  Open two terminals, one to start the backend, one to run the reset script

    ```bash
    # Terminal 1: start the backend server
    python app.py # or python3 app.py

    # Terminal 2: run the reset script
    python init_database.py # or python3 init_database.py
    ```

    On the terminal 2, you will see the following logs,

    ```bash
    Initializing database...
    Users inserted!
    Problems inserted!
    Creating comments and submissions, this may take a while...
    Finish user Tom (1/7)
    Finish user Alice (2/7)
    Finish user John (3/7)
    Finish user Emily (4/7)
    Finish user Michael (5/7)
    Finish user Jason (6/7)
    Finish user Linda (7/7)
    Comments and submissions inserted!
    Database initialized!
    ```

    After that, you can turn off the terminal 1 by `ctrl + c`.

4. Then you can also reset the `tests/test.db` file for the backend testing.

    ```bash
    # in the backend folder, open a terminal
    cp database.db tests/test.db
    ```

## Running Tests

`pytest` is used for testing the backend. To run the tests, follow these steps:

1. Follow the `reset database` steps above to reset the database `tests/test.db` file. This is important as the test cases will insert some data into the database, and we need to reset the database before running the tests.

2. Open a terminal in the backend folder, and run the command:

    ```bash
    # ensure the terminal is in the backend folder
    pytest
    ```

3. When the tests are finished, please follow the `reset database` steps above to reset the database again.

## Examples for Running Code Validation Checks

We provide example scripts to validate code before execution. These checks prevent syntax errors and enforce function signature consistency.

* Compile Check

    This check verifies that the submitted code **compiles without syntax errors**. It uses the `compile()` function to check for syntax errors. Example files include `good.py`, `bad_1.py`, `bad_2.py` and `bad_3.py`.

    ```bash
    # Ensure you are inside the backend folder
    cd backend

    # Navigate to the compile check example
    cd examples/compile-check

    # Run the compile check script
    python check.py
    ```

* Function Signature Check

    This check ensures that the user-submitted function **matches the expected function name and parameters**. It uses the `ast` module to parse the function signature. We require the user submission code to contain the necessary function. And user can still write additonal code. That means, the required signature should be a subset of the user submission code. Example files include `good.py`, `bad_1.py`, `bad_2.py` and `bad_3.py`.

    ```bash
    # Ensure you are inside the backend folder
    cd backend

    # Navigate to the function signature check example
    cd examples/function-signature-check

    # Run the signature validation script
    python check.py
    ```

* Running the Sandbox Execution

    The **sandbox** is responsible for executing user-submitted code in an **isolated Docker container**.

    To run a sandbox demo:

    ```bash
    # Ensure you are inside the backend folder
    cd backend

    # Navigate to the sandbox example
    cd examples/sandbox

    # Run the sandbox execution
    python sandbox.py
    ```

    Feel free to try out different code snippets in the `submission.py` file. 

    We use this command to measure the time and memory usage:

    ```bash
    sh -c '/usr/bin/time -p python3 run.py && echo memory $(cat /sys/fs/cgroup/memory/memory.usage_in_bytes)'
    ```

    The output will display the test case results, execution time, and memory usage. We apply regex to extract the test case result lines, the real time, and the memory usage line. The memory usage is in bytes, so need to $memory/1024/1024$ to get the memory in MB. Similar to leetcode, we only show the first 3 cases' input and output parameters, and the remaining test parameters are hidden.
    
    Here are some examples:

    ```
    # example: correct solution
    2025-03-23 11:17:57 Case 0: Passed
    2025-03-23 11:17:57 Case 1: Passed
    2025-03-23 11:17:57 Case 2: Passed
    2025-03-23 11:17:57 Case 3: Passed
    2025-03-23 11:17:57 Case 4: Passed
    2025-03-23 11:17:57 Case 5: Passed
    2025-03-23 11:17:57 Case 6: Passed
    2025-03-23 11:17:57 Case 7: Passed
    2025-03-23 11:17:57 Case 8: Passed
    2025-03-23 11:17:57 Case 9: Passed
    2025-03-23 11:17:57 memory 1822720
    2025-03-23 11:17:57 real 0.03
    2025-03-23 11:17:57 user 0.02
    2025-03-23 11:17:57 sys 0.00

    # example: timeout solution (use while True)
    2025-03-23 11:14:48 Case 0: Timeout!
    2025-03-23 11:14:48 Case 1: Timeout!
    2025-03-23 11:14:48 Case 2: Timeout!
    2025-03-23 11:14:48 Case 3: Timeout!
    2025-03-23 11:14:48 Case 4: Timeout!
    2025-03-23 11:14:48 Case 5: Timeout!
    2025-03-23 11:14:48 Case 6: Timeout!
    2025-03-23 11:14:48 Case 7: Timeout!
    2025-03-23 11:14:48 Case 8: Timeout!
    2025-03-23 11:14:48 Case 9: Timeout!
    2025-03-23 11:14:48 memory 1474560
    2025-03-23 11:14:48 real 50.02
    2025-03-23 11:14:48 user 50.02
    2025-03-23 11:14:48 sys 0.00

    # example: incorrect solution
    2025-03-23 11:21:50 Case 0: Failed, Input: ([2, 7, 11, 15], 9), Expected: [0, 1], Got: [1, 2, 3]
    2025-03-23 11:21:50 Case 1: Failed, Input: ([3, 2, 4], 6), Expected: [1, 2], Got: [1, 2, 3]
    2025-03-23 11:21:50 Case 2: Failed, Input: ([3, 3], 6), Expected: [0, 1], Got: [1, 2, 3]
    2025-03-23 11:21:50 Case 3: Failed, Hidden Params
    2025-03-23 11:21:50 Case 4: Failed, Hidden Params
    2025-03-23 11:21:50 Case 5: Failed, Hidden Params
    2025-03-23 11:21:50 Case 6: Failed, Hidden Params
    2025-03-23 11:21:50 Case 7: Failed, Hidden Params
    2025-03-23 11:21:50 Case 8: Failed, Hidden Params
    2025-03-23 11:21:50 Case 9: Failed, Hidden Params
    2025-03-23 11:21:50 memory 2011136
    2025-03-23 11:21:50 real 0.03
    2025-03-23 11:21:50 user 0.02
    2025-03-23 11:21:50 sys 0.00
    ```

    The sandbox docker is then removed after the execution.

## Notes

- The **backend** must be running before making API calls.
- Use the **compile check** and **function signature check** to catch errors before running the sandbox.
- Always **build the pre-built Docker image** (`python:3.10-slim-time`) before executing the sandbox.


## Linting

We use `black` for code formatting and linting. To check the code style, run:

```bash
# ensure the terminal is in the backend folder
# for checking the code style
python -m black --check .

# for formatting the code
python -m black .
```
