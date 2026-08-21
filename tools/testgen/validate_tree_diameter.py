#!/usr/bin/env python3
"""Tier 1 + 2 + 3 for tree-diameter.

Tier 1: re-parse every .in token by token exactly as solution.cpp reads it, and
        assert nothing is left over.
Tier 2: every stated bound, plus the input invariant that the trails really form
        a tree (n - 1 of them, connected, no self loops).
Tier 3: re-derive every answer with a rooted "two deepest children" tree dp,
        written iteratively so it shares nothing with the two searches - plus
        closed forms for the path and star shapes, and a check that outpost 1 is
        NOT always an endpoint of a longest route (otherwise the trap that the
        Careful paragraph warns about would never fire).
"""
import sys, os
from collections import deque

T_MAX, N_MAX, SUM_N_MAX = 100, 10**5, 10**5
TESTS = sys.argv[1] if len(sys.argv) > 1 else \
    os.path.join(os.path.dirname(__file__), '../../learntocp/content/problems/tree-diameter/tests')


def parse(path):
    toks = open(path).read().split()
    k = 0
    def nx():
        nonlocal k
        v = toks[k]; k += 1; return int(v)
    t = nx()
    assert 1 <= t <= T_MAX, (path, 't out of range', t)
    cases, total_n = [], 0
    for c in range(t):
        n = nx()
        assert 1 <= n <= N_MAX, (path, c, 'n out of range', n)
        total_n += n
        adj = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = nx(), nx()
            assert 1 <= u <= n and 1 <= v <= n, (path, c, 'endpoint out of range', u, v)
            assert u != v, (path, c, 'self loop', u)
            adj[u].append(v); adj[v].append(u)
        seen, st = [False] * (n + 1), [1]
        seen[1] = True; reached = 0
        while st:
            v = st.pop(); reached += 1
            for to in adj[v]:
                if not seen[to]:
                    seen[to] = True; st.append(to)
        assert reached == n, (path, c, 'trails do not connect everything', reached, n)
        cases.append((n, adj))
    assert k == len(toks), (path, 'trailing tokens', len(toks) - k)
    assert total_n <= SUM_N_MAX, (path, 'sum of n too large', total_n)
    return cases, total_n


def diameter_dp(n, adj):
    """Root at 1, then for every outpost add its two deepest children. Iterative
    so a path of 100000 outposts does not blow the stack."""
    par = [0] * (n + 1)
    seq, st = [], [1]
    seen = [False] * (n + 1); seen[1] = True
    while st:
        v = st.pop(); seq.append(v)
        for to in adj[v]:
            if not seen[to]:
                seen[to] = True; par[to] = v; st.append(to)
    down = [0] * (n + 1)
    best = 0
    for v in reversed(seq):                 # children before parents
        d1 = d2 = 0
        for to in adj[v]:
            if to == par[v]:
                continue
            d = down[to] + 1
            if d > d1: d1, d2 = d, d1
            elif d > d2: d2 = d
        down[v] = d1
        best = max(best, d1 + d2)
    return best


def eccentricity(n, adj, s):
    d = [-1] * (n + 1)
    d[s] = 0
    q = deque([s])
    far = 0
    while q:
        v = q.popleft()
        far = max(far, d[v])
        for to in adj[v]:
            if d[to] == -1:
                d[to] = d[v] + 1
                q.append(to)
    return far


def shape_of(n, adj):
    deg = [len(adj[v]) for v in range(1, n + 1)]
    if n == 1:
        return 'single'
    if n >= 3 and max(deg) == n - 1:
        return 'star'
    if max(deg) <= 2 and deg.count(1) == 2:
        return 'path'
    return None


def main():
    files = sorted(f for f in os.listdir(TESTS) if f.endswith('.in'))
    assert files, 'no tests found'
    trap_cases = 0
    for f in files:
        p = os.path.join(TESTS, f)
        cases, total_n = parse(p)
        out = open(p[:-3] + '.out').read().split('\n')
        while out and out[-1] == '':
            out.pop()
        assert len(out) == len(cases), (f, 'output lines', len(out), len(cases))
        cf = 0
        worst_gap = 0
        for i, (n, adj) in enumerate(cases):
            want = int(out[i])
            assert 0 <= want <= n - 1, (f, i, 'answer outside 0..n-1', want, n)
            got = diameter_dp(n, adj)
            assert got == want, (f, i, 'tree dp disagrees', got, want)
            s = shape_of(n, adj)
            if s == 'single':
                assert want == 0, (f, i); cf += 1
            elif s == 'path':
                assert want == n - 1, (f, i, want, n); cf += 1
            elif s == 'star':
                assert want == 2, (f, i, want); cf += 1
            ecc1 = eccentricity(n, adj, 1)
            if ecc1 < want:
                trap_cases += 1
                worst_gap = max(worst_gap, want - ecc1)
        print(f'{f}: t={len(cases)} sum_n={total_n} closed-form-checked={cf} '
              f'largest one-search shortfall={worst_gap}')
    assert trap_cases > 0, 'no testcase punishes searching only once from outpost 1'
    print('all tree-diameter files OK; testcases where one search from outpost 1 '
          f'is not enough: {trap_cases}')


main()
