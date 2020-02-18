#!/bin/bash

if egrep -rq "(it|describe)\.only" ./cypress; then
    echo "Cypress tests contain only!!"
    exit 1
else
    echo "No only-tests"
    exit 0
fi