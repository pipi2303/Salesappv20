#!/usr/bin/env node
/**
 * EMERGENCY FIX SCRIPT - Fix Failed to fetch module error
 * Run this immediately: node emergency_fix.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY FIX - Removing inline dialogs...\n');

const filePath = path.join(process.cwd(), 'src', 'app', 'components', 'SalesReports.tsx');

try {
    // Read file
    let content = fs.readFileSync(filePath, 'utf-8');
    console.log(`📁 Reading: ${filePath}`);
    console.log(`📊 Original size: ${content.split('\n').length} lines\n`);
    
    // Create backup
    const backupPath = filePath + '.emergency-backup';
    fs.writeFileSync(backupPath, content, 'utf-8');
    console.log(`💾 Backup created: ${backupPath}\n`);
    
    // Find and replace Director Dialog
    console.log('🔄 Step 1/3: Replacing Director Dialog...');
    const directorStart = content.indexOf('{/* Director Overview Dialog */}');
    const directorEnd = content.indexOf('{/* Area Manager Overview Dialog */}');
    
    if (directorStart > -1 && directorEnd > -1) {
        const before = content.substring(0, directorStart);
        const after = content.substring(directorEnd);
        
        const directorReplacement = `{/* Director Overview Dialog */}
      <DirectorDetailDialog
        selectedDirector={selectedDirector}
        onClose={() => setSelectedDirector(null)}
        periodFilter={directorPeriodFilter}
        selectedPeriod={directorSelectedPeriod}
        onPeriodFilterChange={(filter, period) => {
          setDirectorPeriodFilter(filter);
          setDirectorSelectedPeriod(period);
        }}
        aiTab={aiTab}
        onAiTabChange={setAiTab}
      />

      `;
        
        content = before + directorReplacement + after;
        console.log('✅ Director Dialog replaced\n');
    } else {
        console.log('⚠️  Director Dialog markers not found\n');
    }
    
    // Find and replace Area Manager Dialog
    console.log('🔄 Step 2/3: Replacing Area Manager Dialog...');
    const areaStart = content.indexOf('{/* Area Manager Overview Dialog */}');
    const areaEnd = content.indexOf('{/* Sales Manager Overview Dialog */}');
    
    if (areaStart > -1 && areaEnd > -1) {
        const before = content.substring(0, areaStart);
        const after = content.substring(areaEnd);
        
        const areaReplacement = `{/* Area Manager Overview Dialog */}
      <AreaManagerDetailDialog
        selectedAreaManager={selectedAreaManager}
        onClose={() => setSelectedAreaManager(null)}
        periodFilter={areaManagerPeriodFilter}
        selectedPeriod={areaManagerSelectedPeriod}
        onPeriodFilterChange={(filter, period) => {
          setAreaManagerPeriodFilter(filter);
          setAreaManagerSelectedPeriod(period);
        }}
        notes={areaManagerNotes}
        newNote={newNote}
        onNewNoteChange={setNewNote}
        onAddNote={() => addNote('areaManager')}
        onDeleteNote={(id) => deleteNote(id, 'areaManager')}
      />

      `;
        
        content = before + areaReplacement + after;
        console.log('✅ Area Manager Dialog replaced\n');
    } else {
        console.log('⚠️  Area Manager Dialog markers not found\n');
    }
    
    // Find and replace Sales Manager Dialog
    console.log('🔄 Step 3/3: Replacing Sales Manager Dialog...');
    const managerStart = content.indexOf('{/* Sales Manager Overview Dialog */}');
    const managerEnd = content.indexOf('{/* Sales Executive Detail Dialog */}');
    
    if (managerStart > -1 && managerEnd > -1) {
        const before = content.substring(0, managerStart);
        const after = content.substring(managerEnd);
        
        const managerReplacement = `{/* Sales Manager Overview Dialog */}
      <SalesManagerDetailDialog
        selectedManager={selectedSalesManager}
        onClose={() => setSelectedSalesManager(null)}
        periodFilter={managerPeriodFilter}
        selectedPeriod={managerSelectedPeriod}
        onPeriodFilterChange={(filter, period) => {
          setManagerPeriodFilter(filter);
          setManagerSelectedPeriod(period);
        }}
        notes={managerNotes}
        newNote={newNote}
        onNewNoteChange={setNewNote}
        onAddNote={() => addNote('manager')}
        onDeleteNote={(id) => deleteNote(id, 'manager')}
      />

      `;
        
        content = before + managerReplacement + after;
        console.log('✅ Sales Manager Dialog replaced\n');
    } else {
        console.log('⚠️  Sales Manager Dialog markers not found\n');
    }
    
    // Write fixed file
    fs.writeFileSync(filePath, content, 'utf-8');
    
    const newLines = content.split('\n').length;
    console.log('═'.repeat(60));
    console.log('✨ EMERGENCY FIX COMPLETE!');
    console.log('═'.repeat(60));
    console.log(`📈 New file size: ${newLines} lines`);
    console.log(`💾 Backup at: ${backupPath}`);
    console.log('\n🚀 Now restart your dev server:');
    console.log('   npm run dev\n');
    console.log('✅ The "Failed to fetch module" error should be fixed!');
    
} catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log('\n💡 Make sure you run this from project root directory');
    console.log('   Example: node emergency_fix.js');
    process.exit(1);
}
