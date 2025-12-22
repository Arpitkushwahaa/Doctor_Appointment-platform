# Quick Start Script for Performance Testing

Write-Host "🚀 Doctor Appointment Platform - Performance Optimization" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "🔨 Building for production..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 To test performance improvements:" -ForegroundColor Yellow
Write-Host "   1. Run: npm start" -ForegroundColor White
Write-Host "   2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "   3. Open Chrome DevTools (F12)" -ForegroundColor White
Write-Host "   4. Go to Lighthouse tab" -ForegroundColor White
Write-Host "   5. Click 'Analyze page load'" -ForegroundColor White
Write-Host ""
Write-Host "📊 Expected improvements:" -ForegroundColor Cyan
Write-Host "   • 40-60% faster page loads" -ForegroundColor White
Write-Host "   • 80% reduction in API calls" -ForegroundColor White
Write-Host "   • Better loading states" -ForegroundColor White
Write-Host "   • Improved caching" -ForegroundColor White
Write-Host ""
Write-Host "📖 See PERFORMANCE_OPTIMIZATIONS.md for details" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter to start production server"
npm start
