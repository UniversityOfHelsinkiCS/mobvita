#!/bin/bash

if egrep -rq "(it|describe)\.only" ./cypress; then
    exit 1
else
    exit 0
fi