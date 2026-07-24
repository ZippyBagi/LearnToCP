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

# ---------------------------------------------------------------------------
# Petlja adaptations, 2026-07-19 (Zbirka2). All statements are multi-testcase;
# 01.in is the statement example, the rest come from each problem's gen.cpp.
printf '2\n5\n1 3 4 -2 10\n4\n2 2 3 1\n'                                    > $PROB/increasing-segments/tests/01.in
printf '2\n6\n2 -3 4 -1 3 -2\n3\n-5 -2 -8\n'                                > $PROB/max-segment-sum/tests/01.in
printf '2\n6 13\n29 -11 15 13 -68 -4\n3 2\n10 1 4\n'                          > $PROB/street-lamp/tests/01.in
printf '2\n6 7\n2 5 4 7 0 6\n5 8\n1 2 3 4 6\n'                              > $PROB/pairs-with-given-sum/tests/01.in
printf '2\n5 2350\n15745 18095 15745 16234 13395\n4 1\n7 7 8 9\n'            > $PROB/height-difference/tests/01.in
printf '1\n9\n-8 -5 7 4 1 -2 9 -3 2\n'                                      > $PROB/three-sum/tests/01.in
printf '1\n5\n1 2 3 4 5\n3\n0 4\n1 3\n2 2\n'                                > $PROB/segment-sums/tests/01.in
printf '1\n5 5\n1 3 5 6 7\n2 3 4 5 8\n'                                     > $PROB/barcodes/tests/01.in
printf '1\n13 6\n210 2310 390 30 510 66 6 138 46 106 59 17 23\n10 2 6 2 4 15\n' > $PROB/first-not-divisible/tests/01.in

gen_tests increasing-segments 6
gen_tests max-segment-sum 6
gen_tests street-lamp 6
gen_tests pairs-with-given-sum 6
gen_tests height-difference 6
gen_tests three-sum 6
gen_tests segment-sums 6
gen_tests barcodes 5
gen_tests first-not-divisible 5
echo "Petlja adaptation tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptations, batch 2 (Math I, DS I, OT II, Test 1).
printf '2\n17\n903543481\n'                                                  > $PROB/prime-check/tests/01.in
printf '2\n900\n97\n'                                                        > $PROB/prime-factorization/tests/01.in
printf '2\n20 30 40\n1000000000 2000000000 500000000\n'                      > $PROB/gcd/tests/01.in
printf '1\n1 1000\n'                                                         > $PROB/primes-in-interval/tests/01.in
printf '2\n12+3*\n11+2*345+*+\n'                                             > $PROB/postfix-expression/tests/01.in
printf '2\n8 3\n2 2\n'                                                       > $PROB/josephus/tests/01.in
printf '2\npanta redovno zakasni\nneopravdan izostanak\noni su skrsili vagu\nsuvisni kilogrami\n' > $PROB/anagram/tests/01.in
printf '2\n5\n32 11 987 12 3\n2\n91919 919191\n'                             > $PROB/smallest-concatenation/tests/01.in
printf '1\n5 4\n89 73 73 56 23\n95 50 70 0\n'                                > $PROB/above-threshold/tests/01.in
printf '3\n2 13 3\n10 5 3\n3452 20 4\n'                                      > $PROB/last-digits-of-power/tests/01.in
printf '2\n8\n3 5 12 7 5 9 0 17\n3\n0 0 0\n'                                 > $PROB/h-index/tests/01.in
printf '1\n8\n3 7\n7 8\n2 5\n6 8\n4 6\n1 6\n4 5\n1 2\n'                      > $PROB/crowded-pool/tests/01.in

gen_tests prime-check 6
gen_tests prime-factorization 6
gen_tests gcd 5
gen_tests primes-in-interval 5
gen_tests postfix-expression 5
gen_tests josephus 5
gen_tests anagram 5
gen_tests smallest-concatenation 6
gen_tests above-threshold 5
gen_tests last-digits-of-power 5
gen_tests h-index 6
gen_tests crowded-pool 6
echo "Batch 2 tests generated."

# ---------------------------------------------------------------------------
# Codeforces adaptation: Ideal Elections (Round 1103 Div.3, F1). Multi-testcase
# already; the easy version's x=1 is dropped from our input. 01.in batches the
# four official examples; 02-06 come from gen.cpp.
printf '4\n4\n2 3 1 4\n2\n2 4\n6\n3 9 1 6 4 5\n7\n1 2 3 67 13 8 8\n'          > $PROB/ideal-elections/tests/01.in

gen_tests ideal-elections 6
echo "Ideal Elections tests generated."
