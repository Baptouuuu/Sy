#!/bin/bash
grunt jscs
if [[ $? == "1" ]] ; then
    exit 1;
fi;
./node_modules/venus/bin/venus run -t tests/ -c -n --singleton