# !/bin/bash

curl http://localhost:8000/ > /dev/null 2>&1

exit_flag=$?

if [ $exit_flag != 0 ]; then
    echo "API server is not running. Starting..."
    cd ../backend
    source .venv/bin/activate
    python main.py > /dev/null 2>&1
fi
