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
# median-updates + suspicious-transactions: adapted with permission from
# petlja.org (Zbirka2/azuriranje_medijane and Zbirka2/sumnjive_transakcije).
# 01 = statement example, 02 = handcrafted edge cases, 03..06 from gen.cpp.
gen_tests_from3() {
  local slug=$1 count=$2
  local dir=$PROB/$slug/tests
  mkdir -p "$dir"
  g++ -O2 -o /tmp/gen_$slug $slug/gen.cpp
  g++ -O2 -o /tmp/sol_$slug $slug/solution.cpp
  for i in $(seq 3 "$count"); do
    /tmp/gen_$slug "$i" > "$dir/$(printf %02d "$i").in"
  done
  for f in "$dir"/*.in; do
    /tmp/sol_$slug < "$f" > "${f%.in}.out"
  done
}

mkdir -p $PROB/median-updates/tests $PROB/suspicious-transactions/tests

printf '1\n6\nd 5\nd 7\nd 6\nm\nd 8\nm\n' > $PROB/median-updates/tests/01.in
printf '7\n2\nd 1\nm\n3\nd 1\nd 2\nm\n5\nd 1000000000\nd 1000000000\nm\nd 999999999\nm\n7\nd 5\nm\nd 5\nm\nd 5\nm\nd 5\n6\nd 9\nd 7\nd 5\nd 3\nd 1\nm\n6\nd 1\nd 2\nd 3\nd 4\nd 5\nm\n3\nd 1\nd 1000000000\nm\n' > $PROB/median-updates/tests/02.in

printf '1\n8 3\n2 5 3 4 3 6 2 9\n' > $PROB/suspicious-transactions/tests/01.in
printf '8\n2 1\n1 2\n2 2\n2 1\n5 5\n7 7 7 7 7\n6 1\n1 2 4 8 16 32\n4 2\n1000000000 1000000000 1000000000 1000000000\n3 2\n1 1000000000 1000000000\n5 4\n100 50 25 12 6\n6 2\n1 1 1 1 1 1000000000\n' > $PROB/suspicious-transactions/tests/02.in

gen_tests_from3 median-updates 6
gen_tests_from3 suspicious-transactions 6

# permutation-check + strongest-magician: adapted with permission from petlja.org
# (Zbirka2/provera_permutacija1 and Zbirka2/najjaci_madjionicar). Same layout:
# 01 = statement example, 02 = handcrafted edge cases, 03..06 from gen.cpp.
mkdir -p $PROB/permutation-check/tests $PROB/strongest-magician/tests

printf '2\n5\n1 3 2 4 3\n5\n4 3 2 3 1\n3\n1000000000000000000 5 1000000000000000000\n3\n1000000000000000000 5 5\n' > $PROB/permutation-check/tests/01.in
printf '8\n1\n7\n1\n7\n1\n7\n1\n8\n1\n5\n2\n5 5\n2\n5 5\n1\n5\n4\n1000000000000000000 1000000000000000000 1 1\n4\n1 1000000000000000000 1 1000000000000000000\n3\n1000000000000000000 999999999999999999 1000000000000000000\n3\n999999999999999999 1000000000000000000 999999999999999999\n5\n1 2 3 4 5\n5\n5 4 3 2 1\n4\n2 2 2 2\n4\n2 2 2 3\n' > $PROB/permutation-check/tests/02.in

printf '1\n12\ni 1\ni 5\ni 5\ni 8\nm\ne 5\ne 8\nM\ne 5\nM\ne 1\nm\n' > $PROB/strongest-magician/tests/01.in
printf '6\n2\nm\nM\n3\ni 7\nm\nM\n5\ni 4\ni 4\ne 4\nm\nM\n7\ni 999999999\ni 1\nM\nm\ne 999999999\nM\nm\n6\ni 3\ni 3\ni 3\ne 3\ne 3\nM\n8\ni 2\ni 9\ne 2\ne 9\nm\ni 6\nM\nm\n' > $PROB/strongest-magician/tests/02.in

gen_tests_from3 permutation-check 6
gen_tests_from3 strongest-magician 6

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

# ---------------------------------------------------------------------------
# Codeforces adaptations, bitwise operations (L3/01 Binary Numbers + L5/00 Test 1).
# All three are multi-testcase upstream, so the format is kept as is; 01.in is
# our own statement example (also the walkthrough in each editorial).
printf '3\n6 12\n4 9\n5 5\n'                                                  > $PROB/smallest-xor-sum/tests/01.in
printf '4\n2\n5\n17\n1\n'                                                     > $PROB/and-until-zero/tests/01.in
printf '3\n5\n1 4 3 7 10\n4\n6 2 5 3\n2\n2 4\n'                               > $PROB/strong-pairs/tests/01.in

gen_tests smallest-xor-sum 5
gen_tests and-until-zero 5
gen_tests strong-pairs 6
echo "Bitwise adaptation tests generated."

# ---------------------------------------------------------------------------
# Geometry, lesson L6/02 "Lines". Both are our own; 01.in is the statement
# example in each case. segment-intersection also has a brute.cpp (exact
# 128-bit rational parametric solve) used only for cross-checking.
mkdir -p $PROB/two-banks/tests $PROB/segment-intersection/tests
printf '2\n5\n0 0 4 4\n0 4\n1 4\n4 0\n2 2\n5 1\n3\n0 0 1000000000 1000000000\n1000000000 -1000000000\n-1000000000 1000000000\n5 5\n' > $PROB/two-banks/tests/01.in
printf '5\n0 0 4 4 0 4 4 0\n0 0 4 4 0 10 10 0\n0 0 4 4 4 4 8 0\n0 0 4 4 2 2 6 6\n0 0 4 4 1 0 5 4\n' > $PROB/segment-intersection/tests/01.in

gen_tests two-banks 6
gen_tests segment-intersection 6
echo "Geometry tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptation: point-in-polygon (Zbirka3/pripadnost_tacke_prostom_poligonu,
# Društvo matematičara Srbije + Fondacija Petlja). Only the two published
# examples were available, so 01.in batches those and gen.cpp supplies the rest.
# brute.cpp casts a ray in a random direction with exact 128-bit rationals.
mkdir -p $PROB/point-in-polygon/tests
printf '2\n8\n0 0\n5 0\n5 1\n1 1\n1 3\n5 3\n5 4\n0 4\n2 2\n4\n0 0\n5 0\n5 5\n0 5\n2 2\n' > $PROB/point-in-polygon/tests/01.in

gen_tests point-in-polygon 6
echo "Point in polygon tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptations, geometry (L6/02 "Geometry I" and L8/00 "Test 2"):
#   cable-car        <- Zbirka3/sortiranje_duz_linije
#   triangle-quadrants  <- Zbirka3/u_kojim_kvadrantima_je_trougao
#   plate-apart      <- Zbirka3/rastav_translacijom
# All three by Društvo matematičara Srbije + Fondacija Petlja. Only the published
# examples were available (the archive's own test data needs a login), so 01.in
# batches those and gen.cpp supplies the rest. Each has a brute.cpp that answers
# by a completely different route and is used only for cross-checking.
mkdir -p $PROB/cable-car/tests $PROB/triangle-quadrants/tests $PROB/plate-apart/tests

printf '2\n5\n9 4\n5 2\n15 7\n7 3\n13 6\n4\n0 0\n0 5\n0 -3\n0 9\n' > $PROB/cable-car/tests/01.in
printf '4\n1 2 2 5 5 -10\n-1 -1 1 5 5 1\n-10 20 -5 15 -10 15\n0 0 -3 1 1 -3\n' > $PROB/triangle-quadrants/tests/01.in
printf '2\n5 5 6\n3 0\n2 2\n3 1\n3 4\n2 3\n3 5\n5 5 6\n3 0\n2 1\n3 2\n2 3\n3 4\n2 5\n' > $PROB/plate-apart/tests/01.in

gen_tests cable-car 6
gen_tests triangle-quadrants 6
gen_tests plate-apart 6
echo "Petlja geometry adaptation tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptation: morse-sequence (Zbirka2/morzeov_niz, Društvo matematičara
# Srbije + Fondacija Petlja), lesson L6/03 "Recursion". 01.in is our statement
# example (the last two positions are the ones published upstream); 02-06 come
# from gen.cpp. brute.cpp builds the signal literally and is used only for
# cross-checking the small families.
mkdir -p $PROB/morse-sequence/tests
printf '6\n1\n7\n8\n15\n1234\n12345678\n' > $PROB/morse-sequence/tests/01.in

gen_tests morse-sequence 6
echo "Morse sequence tests generated."

# ---------------------------------------------------------------------------
# no-adjacent-ones, lesson L6/03 "Recursion". Ours. The input is a single n, so
# gen.cpp just picks one value per test; 01.in is the statement example.
# brute.cpp enumerates all 2^n bitmasks in increasing order, which cross-checks
# the required output ordering as well as the contents.
mkdir -p $PROB/no-adjacent-ones/tests
printf '4\n' > $PROB/no-adjacent-ones/tests/01.in

gen_tests no-adjacent-ones 6
echo "No adjacent ones tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptation: towers-of-hanoi (Zbirka2/hanojske_kule, Društvo matematičara
# Srbije + Fondacija Petlja), test L8/00 "Test 2". The input is just a list of n,
# so there is no gen.cpp - all files are handcrafted here and only the .out files
# are produced by the reference solution. 01 batches the two published examples
# (n = 3 and n = 2), 02-04 sweep every n from 1 to 16 in order, 05 is the
# heaviest legal load we ship (~1 MB of moves) and 06 is the small edge file.
# brute.cpp (BFS over the state space) cross-checks legality and minimality.
mkdir -p $PROB/towers-of-hanoi/tests
printf '2\n3\n2\n'                          > $PROB/towers-of-hanoi/tests/01.in
printf '8\n1\n2\n3\n4\n5\n6\n7\n8\n'        > $PROB/towers-of-hanoi/tests/02.in
printf '5\n9\n10\n11\n12\n13\n'             > $PROB/towers-of-hanoi/tests/03.in
printf '3\n14\n15\n16\n'                    > $PROB/towers-of-hanoi/tests/04.in
printf '8\n16\n16\n16\n16\n1\n2\n3\n4\n'    > $PROB/towers-of-hanoi/tests/05.in
printf '8\n1\n1\n2\n1\n1\n2\n1\n1\n'        > $PROB/towers-of-hanoi/tests/06.in
g++ -O2 -o /tmp/sol_towers-of-hanoi towers-of-hanoi/solution.cpp
for f in $PROB/towers-of-hanoi/tests/*.in; do
  /tmp/sol_towers-of-hanoi < "$f" > "${f%.in}.out"
done
echo "Towers of Hanoi tests generated."

# ---------------------------------------------------------------------------
# Graph Theory I (L7/01) and Test 2 (L8/00). Four Petlja adaptations - all by
# Društvo matematičara Srbije + Fondacija Petlja - and one problem of our own:
#   most-popular-site   <- Zbirka3/najpopularniji_sajt
#   islands             <- ours
#   bus-routes          <- Zbirka3/kruzni_autobusi
#   caves               <- Zbirka3/pecine
#   snakes-and-ladders  <- Zbirka3/zmije_i_lestve
#   line-of-succession  <- Zbirka3/prestolonaslednici
# The archive's own test data needs a login, so 01.in batches the published
# examples, 02 is handcrafted degenerates from gen.cpp and 03-06 are generated.
# Each problem has a brute.cpp that reaches the answer by a different route and
# is used only for cross-checking.
mkdir -p $PROB/most-popular-site/tests $PROB/islands/tests $PROB/bus-routes/tests \
         $PROB/caves/tests $PROB/snakes-and-ladders/tests $PROB/line-of-succession/tests

printf '1\n4 9\n1 2\n1 4\n2 1\n2 2\n2 4\n3 2\n3 4\n4 1\n4 4\n' > $PROB/most-popular-site/tests/01.in
printf '1\n4 6\n#..##.\n##..#.\n....#.\n.##..#\n'               > $PROB/islands/tests/01.in
printf '1\n7 2\n3 1 2 7\n3 3 6 7\n1 6\n'                        > $PROB/bus-routes/tests/01.in
printf '1\n278 7\n1 2 -20\n1 3 -10\n2 4 -5\n2 5 10\n3 6 -33\n3 7 7\n' > $PROB/caves/tests/01.in
printf '2\n18 2 5\n2 12\n3 13\n8 17\n11 1\n14 7\n5 2 2\n1 3\n3 1\n'   > $PROB/snakes-and-ladders/tests/01.in
printf '1\n19\nElisabeth Charles\nElisabeth Andrew\nElisabeth Edward\nElisabeth Anne\nCharles William\nWilliam George\nCharles Harry\nWilliam Charlotte\nWilliam Louis\nAnne Peter\nAnne Zara\nEdward James\nAndrew Beatrice\nAndrew Eugenie\nEdward Louise\nPeter Savannah\nPeter Isla\nZara Mia\n7\nHarry\nCharles\nCharlotte\nLouise\nJames\nIsla\nAndrew\n' > $PROB/line-of-succession/tests/01.in

gen_tests most-popular-site 6
gen_tests islands 6
gen_tests bus-routes 6
gen_tests caves 6
gen_tests snakes-and-ladders 6
gen_tests line-of-succession 6
echo "Graph Theory I + Test 2 tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptation: trees + trees-2 (Zbirka2/drva, Društvo matematičara Srbije
# + Fondacija Petlja), lesson L7/02 "Binary Search by Answer". The upstream
# problem is single-case with one required amount; 01.in batches the published
# example with a one-tree case of our own. trees-2 is our harder variant - the
# same forest is asked q times, which is what kills the O(n) check.
# brute.cpp for trees scans every height from the top down; brute.cpp for
# trees-2 reaches the answer with the O(n) check instead of prefix sums.
mkdir -p $PROB/trees/tests $PROB/trees-2/tests
printf '2\n5 14\n24 21 19 14 22\n1 7\n7\n'                          > $PROB/trees/tests/01.in
printf '2\n5 3\n24 21 19 14 22\n14 40 1\n1 2\n7\n7 3\n'             > $PROB/trees-2/tests/01.in

gen_tests trees 6
gen_tests trees-2 6
echo "Woodcutter I + II tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptation: merge-two-sorted-arrays (Zbirka2/objedinjavanje, Društvo
# matematičara Srbije + Fondacija Petlja), test L5/00 "Test 1". 01.in batches
# the published example with a case of our own where one list empties first.
# brute.cpp is the lazy concatenate-and-sort solution, used only for
# cross-checking.
mkdir -p $PROB/merge-two-sorted-arrays/tests
printf '2\n4 3\n1 3 5 7\n2 4 5\n1 5\n10\n1 2 3 4 5\n' > $PROB/merge-two-sorted-arrays/tests/01.in

gen_tests merge-two-sorted-arrays 6
echo "Merge two sorted arrays tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptations for Divide and Conquer (L7/02) and Test 2 (L8/00), both by
# Društvo matematičara Srbije + Fondacija Petlja:
#   inversions      <- Zbirka2/broj_inverzija
#   third-traversal <- Zbirka2/treci_obilazak
# Upstream both are single-case; 01.in batches the published example (plus a
# second case of ours for inversions). brute.cpp for inversions is the O(n^2)
# definition; brute.cpp for third-traversal really builds the tree and walks it.
mkdir -p $PROB/inversions/tests $PROB/third-traversal/tests
printf '2\n5\n3 1 4 2 5\n4\n4 3 2 1\n' > $PROB/inversions/tests/01.in
printf '1\nabecfg\nbeafcg\n'           > $PROB/third-traversal/tests/01.in

gen_tests inversions 6
gen_tests third-traversal 6
echo "Inversions + third traversal tests generated."

# ---------------------------------------------------------------------------
# max-changing-segment, lesson L9/02 "Segment Trees". Ours, not a petlja
# adaptation. The solution is the lesson's own iterative segment tree with the
# operation swapped to max (and the neutral value with it), so the tests care
# about two things: sizes around powers of two, where the padding leaves live,
# and all-negative testcases, which is what a starting value of 0 gets wrong.
# brute.cpp keeps the plain array and rescans the range on every question.
mkdir -p $PROB/max-changing-segment/tests
printf '2\n6 6\n3 1 4 1 5 9\na 0 5\na 1 3\nb 2 7\na 1 3\nb 5 -2\na 0 5\n1 3\n-5\na 0 0\nb 0 10\na 0 0\n' > $PROB/max-changing-segment/tests/01.in

gen_tests max-changing-segment 6
echo "Maximum of a changing segment tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptations for Fenwick Trees (L9/02), both by Društvo matematičara
# Srbije + Fondacija Petlja:
#   segment-sums-changing  <- Zbirka3/sume_segmenata_promenljivog_niza1
#   inversions-after-removal <- Zbirka3/inverzije_nakon_izbacivanja_segmenata
# The petlja query letters p/z were renamed to s/q. 01.in for the second problem
# batches all four published examples. Both brute.cpp files ignore the tree
# entirely: one rescans the range, the other rebuilds b for every pair.
mkdir -p $PROB/segment-sums-changing/tests $PROB/inversions-after-removal/tests
printf '1\n5 5\n1 2 3 4 5\nq 0 4\nq 2 3\ns 2 5\ns 3 6\nq 0 4\n' > $PROB/segment-sums-changing/tests/01.in
printf '4\n3 1\n1 3 2\n3 0\n1 3 2\n5 2\n1 5 4 1 100\n5 4\n1 5 4 1 100\n' > $PROB/inversions-after-removal/tests/01.in

gen_tests segment-sums-changing 6
gen_tests inversions-after-removal 6
echo "Fenwick tree problems tests generated."

# ---------------------------------------------------------------------------
# inversions-2: the same problem as inversions (Zbirka2/broj_inverzija, Društvo
# matematičara Srbije + Fondacija Petlja), repeated after the Fenwick Trees
# lesson so it can be solved a second way. gen.cpp and brute.cpp are copies of
# the ones in inversions/ - same problem, same data on purpose - and the .out
# files must come out byte for byte identical to inversions/.
mkdir -p $PROB/inversions-2/tests
printf '2\n5\n3 1 4 2 5\n4\n4 3 2 1\n' > $PROB/inversions-2/tests/01.in

gen_tests inversions-2 6
echo "Inversions II tests generated."

# ---------------------------------------------------------------------------
# Petlja adaptations for Topological Sorting (L9/01), both by Društvo
# matematičara Srbije + Fondacija Petlja:
#   job-order   <- Zbirka3/redosled_poslova
#   cycle-check <- Zbirka3/provera_ciklusa
# Upstream job-order accepts ANY valid ordering; ours pins it to the
# lexicographically smallest one so the judge can compare exactly - petlja's own
# published example output already is that one. Note the reversed pair order:
# the line "x y" means y comes before x, so the arrow runs y -> x.
# cycle-check prints yes/no rather than da/ne, since the tests are shared
# between locales. Its multi-world wrapper is already our testcase count.
# brute.cpp for job-order rescans the ready jobs each step instead of using a
# heap; brute.cpp for cycle-check uses iterative DFS three-colouring, which
# shares nothing with Kahn's counting.
mkdir -p $PROB/job-order/tests $PROB/cycle-check/tests
printf '1\n6 6\n3 1\n3 2\n4 2\n4 5\n1 0\n0 5\n' > $PROB/job-order/tests/01.in
printf '2\n5 5\n0 1\n2 1\n2 3\n3 4\n4 2\n5 5\n0 1\n2 1\n2 3\n3 4\n4 0\n' > $PROB/cycle-check/tests/01.in

gen_tests job-order 6
gen_tests cycle-check 6
echo "Topological sorting problems tests generated."
