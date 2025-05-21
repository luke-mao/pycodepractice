import ast


# Extract function names and argument names from Python code using AST.
def extract_function_signature(code):
    try:
        tree = ast.parse(code)
        functions = {
            node.name: [arg.arg for arg in node.args.args]
            for node in tree.body
            if isinstance(node, ast.FunctionDef)
        }
        return functions
    except SyntaxError:
        return None


# Check if the template function is all present in the submission
def check_is_template_function_present(template_code, submission_code):
    template_signature = extract_function_signature(template_code)
    submission_signature = extract_function_signature(submission_code)

    # usually this will not happen, but just in case
    if template_signature is None:
        print(
            "Error in the submission template code, please contact the administrator."
        )
        return

    if submission_signature is None:
        print(
            "Error in the submission code. Please implement the function as per the template."
        )
        return

    for func_name, params in template_signature.items():
        if func_name not in submission_signature:
            # raise ValueError(f"Function '{func_name}' is missing in the submission.")
            print(f"Function '{func_name}' is missing in the submission.")
            return

        if submission_signature[func_name] != params:
            # raise ValueError(f"Function '{func_name}' has incorrect parameters. Expected {params}.")
            print(
                f"Function '{func_name}' has incorrect parameters. Expected {params}."
            )
            return

    print("Submission is valid!")


if __name__ == "__main__":
    # load the local files: good.py, bad_1.py, bad_2.py, bad_3.py
    # template file: submission_template.py
    with open("submission_template.py", "r") as file:
        template_code = file.read()

    with open("good.py", "r") as file:
        good_code = file.read()

    with open("bad_1.py", "r") as file:
        bad_code_1 = file.read()

    with open("bad_2.py", "r") as file:
        bad_code_2 = file.read()

    with open("bad_3.py", "r") as file:
        bad_code_3 = file.read()

    # Running the checks
    print("Test 1 (Good Submission):")
    check_is_template_function_present(template_code, good_code)

    print("Test 2: Bad")
    check_is_template_function_present(template_code, bad_code_1)

    print("Test 3: Bad")
    check_is_template_function_present(template_code, bad_code_2)

    print("Test 4: Bad")
    check_is_template_function_present(template_code, bad_code_3)
