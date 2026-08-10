#include <bits/stdc++.h>
using namespace std;

int dfs(int row, int col, vector<string>& grid, vector<vector<bool>>& visited) {

    int n = grid.size(), m = grid[0].size();

    if(row < 0 || row >= n || col < 0 || col >= m) return 0; // outside the photo
    if(grid[row][col] != '#' || visited[row][col]) return 0; // water, or already counted

    visited[row][col] = true; // before the calls, so they cannot come back here

    int size = 1; // this square

    size += dfs(row - 1, col, grid, visited); // up
    size += dfs(row + 1, col, grid, visited); // down
    size += dfs(row, col - 1, grid, visited); // left
    size += dfs(row, col + 1, grid, visited); // right

    return size;
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n, m;
        cin >> n >> m;

        vector<string> grid(n);
        for(int i=0;i<n;i++) cin >> grid[i];

        vector<vector<bool>> visited(n, vector<bool>(m, false));

        int islands = 0, largest = 0;

        for(int row=0;row<n;row++) {
            for(int col=0;col<m;col++) {

                int size = dfs(row, col, grid, visited); // 0 if water, or land we already counted

                if(size > 0) { // nobody had reached this island before
                    islands++;
                    largest = max(largest, size);
                }
            }
        }

        cout << islands << " " << largest << "\n";
    }

    return 0;
}
