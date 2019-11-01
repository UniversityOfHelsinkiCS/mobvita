#!/bin/bash

# Give your username as the argument
ssh -N -L 8001:svm-83.cs.helsinki.fi:80 "$1@melkki.cs.helsinki.fi"
