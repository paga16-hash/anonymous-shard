#!/bin/bash

# Define the directory containing the result files
RESULTS_DIR="results/"

# Initialize variables
start_time=""
end_time=""
total_tasks=0

# Loop through all files in the results directory
for file in "$RESULTS_DIR"*.json; do
  while IFS= read -r line; do
    # Extract 'timestamp' and 'type'
    if [[ $line == *'"timestamp":'* ]]; then
      timestamp=$(echo "$line" | sed -E 's/.*"timestamp": "(.*)Z".*/\1/')

      # Convert timestamp to seconds since epoch using macOS date
      timestamp_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${timestamp:0:19}" +"%s")

      # Update start_time and end_time
      if [[ -z "$start_time" || $timestamp_epoch -lt $start_time ]]; then
        start_time=$timestamp_epoch
      fi
      if [[ -z "$end_time" || $timestamp_epoch -gt $end_time ]]; then
        end_time=$timestamp_epoch
      fi
    fi

    if [[ $line == *'"type": 0'* ]]; then
      total_tasks=$((total_tasks + 1))
    fi
  done < "$file"
done

if [[ $total_tasks -gt 0 && $start_time -ne "" && $end_time -ne "" ]]; then
  total_time_ms=$(( (end_time - start_time) * 1000 ))
  avg_time_ms=$((total_time_ms / total_tasks))

  echo "Task Type: Sum | Total time for $total_tasks: ${total_time_ms} ms | Time per Task in milliseconds: ${avg_time_ms} ms"
else
  echo "No tasks with type 0 (SUM) found in the results folder or timestamps are missing."
fi
