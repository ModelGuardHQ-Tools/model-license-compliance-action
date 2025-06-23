# model-license-compliance-action
GitHub Action to enforce AI/ML model license attributions in CI/CD.


## Quickstart

1. **Add to your workflow**

   ```yaml
   # .github/workflows/ci.yml
   on: [push,pull_request]
   jobs:
     license-check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Model License Compliance
           uses: ModelGuardHQ-Tools/model-license-compliance-action@v1.0.1
