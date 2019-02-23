# How many workers to have
numworkers=10

while "true"; do
    if [ $(ps aux | grep 'node worker.js' | grep -v grep | wc -l) -lt $numworkers ]; then
        todo=$(( $numworkers - `ps aux | grep 'node worker.js' | grep -v grep | wc -l` ))
        printf "Workers missing: $todo\n"
        nohup node worker.js $(( $todo -1 )) &
    fi 

    sleep 1
done