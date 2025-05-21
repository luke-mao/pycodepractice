# In the same folder, there are 3 test cases:
# good.py, bad_1.py, and bad_2.py
# three files in the same folder: good.py, bad_1.py, and bad_2.py
import os


def check_syntax(code):
    try:
        compile(code, "<submitted_code>", "exec")  # Compile the code (no execution)
        print("✅ Code is syntactically valid")
    except SyntaxError as e:
        print(f"❌ Syntax Error: {e}")


def load_file(filename):
    with open(filename, "r") as file:
        return file.read()


good = load_file("good.py")
check_syntax(good)

bad_1 = load_file("bad_1.py")
check_syntax(bad_1)

bad_2 = load_file("bad_2.py")
check_syntax(bad_2)
