#!/bin/bash
grunt jscs && ./node_modules/venus/bin/venus run -t tests/ -c -n --singleton