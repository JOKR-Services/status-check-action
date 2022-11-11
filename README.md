# status-check-action
GitHub Action for checking if all the jobs passed that ran in a workflow

## Usage 

Add it to the end of your workflow in a separate job. It needs to depend on all previous jobs, so it can check the status of each.
### Example
```yaml
jobs:
  ...
  status-check:
    runs-on: ubuntu-latest
    name: Status Check
    if: always()
    needs: ['job-1', 'job-2', 'job-n']
    steps:
      - uses: JOKR-Services/status-check-action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Development

Add your changes to the `index.ts` file. Once done, run the `npm run build` command to create the javascript distributable.
When finished, create a pull request.