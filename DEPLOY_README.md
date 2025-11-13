# Deployment Instructions

## Quick Deploy

```bash
./deploy.sh
```

That's it! The script will handle everything.

## What the Script Does

1. ✅ **Loads credentials** from `.env.production`
2. ✅ **Validates all files** are present before deploying
3. ✅ **Creates backup** of current production site
4. ✅ **Uploads all files** via SFTP
5. ✅ **Verifies deployment** succeeded
6. ✅ **Shows summary** of what was deployed

## Usage Options

### Standard Deployment
```bash
./deploy.sh
```
- Creates backup
- Uploads all files
- Asks for confirmation

### Dry Run (Test Without Deploying)
```bash
./deploy.sh --dry-run
```
- Shows what would be deployed
- Doesn't upload anything
- Safe to run anytime

### Skip Backup
```bash
./deploy.sh --no-backup
```
- Faster deployment
- No backup created
- Use only if you have external backups

### Help
```bash
./deploy.sh --help
```
- Shows all available options

## First Time Setup

The script needs `sshpass` for automated SFTP. It will install automatically, but you can install manually:

```bash
brew install hudochenkov/sshpass/sshpass
```

## Files Deployed

The script uploads:
- ✅ All HTML pages (8 files)
- ✅ CSS stylesheets
- ✅ JavaScript files
- ✅ PHP backend files
- ✅ All CSV data files
- ✅ Complete assets/ directory (images, WebP variants)

## Backups

Backups are stored in: `backups/backup-YYYYMMDD-HHMMSS/`

To restore from backup:
1. Find your backup in the `backups/` folder
2. Use SFTP to upload files manually
3. Or run deployment script after copying backup files to main directory

## Troubleshooting

### "sshpass not found"
```bash
brew install hudochenkov/sshpass/sshpass
```

### "Missing required files"
The script will tell you which files are missing. Make sure you're running from the project root.

### "Upload failed"
- Check your internet connection
- Verify credentials in `.env.production`
- Make sure the server is accessible

### Test Connection Manually
```bash
ssh a9a8a5f7_1@b44cf7bf48.nxcli.io
```
Enter password when prompted. If this works, the deploy script should work.

## Post-Deployment Checklist

After deployment:
- [ ] Visit website homepage
- [ ] Check all navigation links
- [ ] Verify CSV data loaded (newspapers, radio, printing)
- [ ] Test contact form
- [ ] Check images display correctly
- [ ] Test on mobile device

## Security Notes

- ✅ `.env.production` is gitignored (credentials never committed)
- ✅ Backups are local only (not uploaded to GitHub)
- ✅ Script requires confirmation before deploying
- ✅ Password stored securely in environment file

## Need Help?

1. Run `./deploy.sh --help` to see options
2. Run `./deploy.sh --dry-run` to test without deploying
3. Check DEPLOYMENT.md for hosting service alternatives
