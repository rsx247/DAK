# Git Workflow Guide - Preventing Lost Files

## The Problem You Had

When you manually upload files through GitHub's web interface, they exist **only on GitHub**. When you push from Google AI Studio (or any local Git), it overwrites the remote with your local files. If the files aren't in your local repository, they get deleted.

## The Solution

**Always add files to your local Git repository before pushing.**

## Simple Workflow

### When Adding New Files:

1. **Add files to Git:**
   ```bash
   git add assets/
   ```

2. **Commit the changes:**
   ```bash
   git commit -m "Add assets folder"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### When Pushing from Google AI Studio:

**Before pushing, always pull first:**
```bash
git pull origin main
```

This ensures your local repository has all the latest files from GitHub, including any you uploaded via the web interface.

## Complete Safe Workflow

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Make your changes** (in Google AI Studio or locally)

3. **Add any new files:**
   ```bash
   git add .
   ```

4. **Commit:**
   ```bash
   git commit -m "Your commit message"
   ```

5. **Push:**
   ```bash
   git push origin main
   ```

## Quick Reference

- `git pull` = Download changes from GitHub to your computer
- `git add .` = Stage all changes (tell Git to track them)
- `git commit` = Save changes locally
- `git push` = Upload changes to GitHub

## What Happened to Your Assets Folder

✅ **FIXED!** The assets folder is now properly tracked in Git and won't disappear on future pushes.

The folder structure is now:
- `assets/logos/` - All logo files
- `assets/logos/thumbs/` - All thumbnail files
- `assets/logos.zip` - Zip archive

All of these are now in Git and will persist through future pushes.

