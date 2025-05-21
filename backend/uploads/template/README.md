## New Challenge Files Template

Steps to follow to create a new challenge file:

1. Fill the [description_template.md](./description_template.md) file with the challenge description. Markdown can be used. 

2. Fill the [solution_template.py](./solution_template.py) file with the solution to the challenge. And rename the file to `solution.py`.

3. Fill the [submisson_template_template.py](./submission_template_template.py) file by copying the solution from the `solution.py` file, keep the function name as it is, and replace the function boby with `pass`. And rename the file to `submission_template.py`.

4. Fill the [testcase_template.py](./testcase_template.py) file with the test cases for the challenge. Typically we will have 10 test cases. And rename the file to `testcase.py`.

5. Open the `docker desktop` environment and run the sandbox to test if your solution is working fine. 

    ```bash
    python sandbox.py # or python3 sandbox.py on mac
    ```

    If the solution is working fine, you will see all test cases passed. 

6. Submit the challenge by uploading the files:

    * description.md
    * solution.py
    * submission_template.py
    * testcase.py