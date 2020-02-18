#!/bin/bash

if egrep -rq "(it|describe)\.only" ./cypress; then
    echo "Do not commit .only-tests"
    exit 1
else
    echo "No .only-tests found"
    exit 0
fi