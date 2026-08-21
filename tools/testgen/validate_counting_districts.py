#!/usr/bin/env python3
"""Tier 1 + 2 + 3 for counting-districts.

Tier 1: re-parse every .in token by token in exactly the order solution.cpp
        reads them, and assert nothing is left over.
Tier 2: every stated bound, including the relational ones (u != v, the edges
        really form a tree) and the sum-over-testcases bound.
Tier 3: re-derive the answers a second way - each district counted at its
        SMALLEST numbered city instead of at its topmost one under a root at 1 -
        plus closed forms for the path and star shapes.
"""
import sys, os
from math import comb

MOD = 10**9 + 7
T_MAX, N_MAX, K_MAX, SUM_N_MAX = 100, 1000, 100, 5000
TESTS = sys.argv[1] if len(sys.argv) > 1 else \
    os.path.join(os.path.dirname(__file__), '../../learntocp/content/problems/counting-districts/tests')


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
        n, K = nx(), nx()
        assert 1 <= n <= N_MAX, (path, c, 'n out of range', n)
        assert 1 <= K <= K_MAX, (path, c, 'K out of range', K)
        total_n += n
        adj = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = nx(), nx()
            assert 1 <= u <= n and 1 <= v <= n, (path, c, 'endpoint out of range', u, v)
            assert u != v, (path, c, 'self loop', u)
            adj[u].append(v); adj[v].append(u)
        # a tree: n-1 edges and connected is enough
        seen, st = [False] * (n + 1), [1]
        seen[1] = True; reached = 0
        while st:
            v = st.pop(); reached += 1
            for to in adj[v]:
                if not seen[to]:
                    seen[to] = True; st.append(to)
        assert reached == n, (path, c, 'not connected', reached, n)
        cases.append((n, K, adj))
    assert k == len(toks), (path, 'trailing tokens', len(toks) - k)
    assert total_n <= SUM_N_MAX, (path, 'sum of n too large', total_n)
    return cases, total_n


def order(n, adj, root):
    """iterative DFS order and parents, rooted at `root`, over the vertices the
    walk can actually reach (used for the min-index check, where the graph is a
    forest restricted to the allowed vertices)."""
    par = {root: 0}
    seq, st = [], [root]
    while st:
        v = st.pop(); seq.append(v)
        for to in adj[v]:
            if to != par[v] and to not in par:
                par[to] = v; st.append(to)
    return seq, par


def count_min_index(n, K, adj):
    """Every district has exactly one smallest-numbered city. Fix that city r,
    throw away every city below r, and count the districts containing r inside
    what is left. Different rooting, different subgraph, different attribution -
    it shares no state with the reference."""
    total = 0
    for r in range(1, n + 1):
        allowed = lambda x: x >= r
        adj_r = [[] for _ in range(n + 1)]
        # only the component of r matters, so build it lazily by walking from r
        seq, par = [], {r: 0}
        st = [r]
        while st:
            v = st.pop(); seq.append(v)
            for to in adj[v]:
                if allowed(to) and to not in par:
                    par[to] = v; st.append(to)
                if allowed(to):
                    adj_r[v].append(to)
        cnt = {}
        for v in reversed(seq):              # children are finished before parents
            cur = [0, 1]
            for to in adj_r[v]:
                if to == par[v] or to not in cnt:
                    continue
                sub = cnt[to]
                lim = min(len(cur) - 1 + len(sub) - 1, K)
                nxt = [0] * (lim + 1)
                for a in range(1, len(cur)):
                    if cur[a] == 0:
                        continue
                    nxt[a] = (nxt[a] + cur[a]) % MOD
                    for b in range(1, len(sub)):
                        if a + b > lim:
                            break
                        nxt[a + b] = (nxt[a + b] + cur[a] * sub[b]) % MOD
                cur = nxt
            cnt[v] = cur
        total = (total + sum(cnt[r][1:])) % MOD
    return total


def shape_of(n, adj):
    deg = [len(adj[v]) for v in range(1, n + 1)]
    if n >= 3 and max(deg) == n - 1:
        return 'star'
    if n >= 2 and max(deg) <= 2 and deg.count(1) == 2:
        return 'path'
    if n == 1:
        return 'single'
    return None


def closed_form(shape, n, K):
    if shape == 'single':
        return 1
    if shape == 'path':
        return sum(n - j + 1 for j in range(1, min(K, n) + 1)) % MOD
    if shape == 'star':
        return (n + sum(comb(n - 1, j - 1) for j in range(2, min(K, n) + 1))) % MOD
    return None


def main():
    files = sorted(f for f in os.listdir(TESTS) if f.endswith('.in'))
    assert files, 'no tests found'
    grand = 0
    for f in files:
        p = os.path.join(TESTS, f)
        cases, total_n = parse(p)
        out = open(p[:-3] + '.out').read().split('\n')
        while out and out[-1] == '':
            out.pop()
        assert len(out) == len(cases), (f, 'output lines', len(out), len(cases))
        for v in out:
            assert 0 <= int(v) < MOD, (f, 'answer outside the modulus', v)
        checked_alt = checked_cf = 0
        for i, (n, K, adj) in enumerate(cases):
            want = int(out[i])
            cf = closed_form(shape_of(n, adj), n, K)
            if cf is not None:
                assert cf == want, (f, i, 'closed form', cf, want)
                checked_cf += 1
            if n <= 500:
                alt = count_min_index(n, K, adj)
                assert alt == want, (f, i, 'min-index count', alt, want)
                checked_alt += 1
        grand += total_n
        print(f'{f}: t={len(cases)} sum_n={total_n} '
              f'min-index-checked={checked_alt} closed-form-checked={checked_cf} OK')
    print('all counting-districts files OK, total cities across the set:', grand)


main()
