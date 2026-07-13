#!/usr/bin/env bash
# Regenerates all tests for the DP problems.
# For each problem: compiles gen.cpp + solution.cpp, writes tests/01.in (the
# statement example) by hand, generates 02..NN.in with gen, and produces the
# .out files by running the reference solution.
set -euo pipefail
cd "$(dirname "$0")"
PROB=../../learntocp/content/problems

gen_tests() {
  local slug=$1 count=$2
  local dir=$PROB/$slug/tests
  mkdir -p "$dir"
  g++ -O2 -o /tmp/gen_$slug $slug/gen.cpp
  g++ -O2 -o /tmp/sol_$slug $slug/solution.cpp
  for i in $(seq 2 "$count"); do
    /tmp/gen_$slug "$i" > "$dir/$(printf %02d "$i").in"
  done
  for f in "$dir"/*.in; do
    /tmp/sol_$slug < "$f" > "${f%.in}.out"
  done
}

# 01.in = the example from the problem statement
printf '3 3\n1 2 3\n4 5 6\n7 8 9\n'            > $PROB/max-matrix-sum/tests/01.in
printf '5\n2 7 9 3 1\n'                        > $PROB/robber/tests/01.in
printf 'abcde\nace\n'                          > $PROB/lcs/tests/01.in
printf '8\n3 6 1 2 8 2 4 5\n'                  > $PROB/lis/tests/01.in
printf '8\n3 6 1 2 8 2 4 5\n'                  > $PROB/lis-2/tests/01.in
printf '4 5\n4 1\n5 2\n1 3\n3 4\n'             > $PROB/knapsack/tests/01.in
printf '4\n1 3\n2 5\n4 7\n6 9\n'                > $PROB/movie-marathon/tests/01.in
printf '(()())\n'                            > $PROB/balanced-brackets/tests/01.in
printf 'banana\n'                             > $PROB/letter-frequency/tests/01.in

# monopoly: all tests handcrafted (adapted with permission from petlja.org
# Zbirka3/monopol; the 10 original single cases are batched into files 02-05,
# 06 is edge cases). No gen.cpp - only .out files are regenerated.
mkdir -p $PROB/monopoly/tests
printf '2\n10 3 7\n10 7 3\n'                                    > $PROB/monopoly/tests/01.in
printf '3\n64 27 5\n198 63 141\n202 20 176\n'                   > $PROB/monopoly/tests/02.in
printf '3\n396 245 330\n478 18 241\n390 301 252\n'              > $PROB/monopoly/tests/03.in
printf '2\n513 262 323\n199 74 163\n'                           > $PROB/monopoly/tests/04.in
printf '2\n78 6 46\n766 726 18\n'                               > $PROB/monopoly/tests/05.in
printf '7\n1 0 0\n1 1000000000 999999999\n5 7 7\n10 13 3\n1000000000 0 999999999\n1000000000 999999999 0\n1000000000 1000000000 999999999\n' > $PROB/monopoly/tests/06.in
g++ -O2 -o /tmp/sol_monopoly monopoly/solution.cpp
for f in $PROB/monopoly/tests/*.in; do
  /tmp/sol_monopoly < "$f" > "${f%.in}.out"
done

gen_tests max-matrix-sum 5
gen_tests robber 5
gen_tests lcs 5
gen_tests lis 5
gen_tests lis-2 6
gen_tests knapsack 5
gen_tests movie-marathon 6
gen_tests balanced-brackets 7
gen_tests letter-frequency 5
echo "All tests generated."
