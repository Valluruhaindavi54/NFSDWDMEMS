# Branching Strategy

This project follows a simple Git branching model.

## Main Branches
- **main**  
  - Production-ready code.
  - Only stable, tested features are merged here.

- **develop**  
  - Integration branch for features before merging to main.
  - Always contains the latest completed development work.

## Supporting Branches
- **feature/{feature-name}**  
  - Created from `develop`.  
  - Used to develop a new feature.  
  - Merge back into `develop` after completion.

- **hotfix/{hotfix-name}**  
  - Created from `main`.  
  - Used to fix critical bugs in production.  
  - Merge back into both `main` and `develop`.

- **release/{version}** *(optional)*  
  - Prepares a new production release.  
  - Created from `develop`.  
  - After testing, merged into `main` and `develop`.

## Example Commands
```bash
# Create a feature branch
git checkout develop
git checkout -b feature/login-page

# Push feature branch to remote
git push origin feature/login-page

# Merge back into develop after work
git checkout develop
git merge feature/login-page
git push origin develop
