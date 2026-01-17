from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TERRAFORM_DIR = "/app/terraform"


def run_tf(cmd):
    result = subprocess.run(
        cmd,
        cwd=TERRAFORM_DIR,
        capture_output=True,
        text=True
    )

    return {
        "status": "success" if result.returncode == 0 else "failed",
        "output": result.stdout if result.stdout else result.stderr
    }


@app.post("/init")
def init():
    return run_tf(["terraform", "init", "-no-color"])


@app.post("/plan")
def plan():
    return run_tf(["terraform", "plan", "-no-color"])


@app.post("/apply")
def apply():
    return run_tf(["terraform", "apply", "-auto-approve", "-no-color"])


@app.post("/destroy")
def destroy():
    return run_tf(["terraform", "destroy", "-auto-approve", "-no-color"])


@app.get("/state")
def state():
    return run_tf(["terraform", "state", "list"])

