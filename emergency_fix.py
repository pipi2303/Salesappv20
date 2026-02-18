#!/usr/bin/env python3
"""
EMERGENCY FIX - Fix "Failed to fetch module" error
Run: python3 emergency_fix.py
"""

import re

print("🚨 EMERGENCY FIX - Removing inline dialogs...\n")

file_path = "src/app/components/SalesReports.tsx"

try:
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_lines = len(content.split('\n'))
    print(f"📁 Reading: {file_path}")
    print(f"📊 Original size: {original_lines} lines\n")
    
    # Create backup
    backup_path = file_path + '.emergency-backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"💾 Backup created: {backup_path}\n")
    
    # Replace Director Dialog
    print("🔄 Step 1/3: Replacing Director Dialog...")
    director_start_marker = '{/* Director Overview Dialog */}'
    director_end_marker = '{/* Area Manager Overview Dialog */}'
    
    start_idx = content.find(director_start_marker)
    end_idx = content.find(director_end_marker)
    
    if start_idx > -1 and end_idx > -1:
        director_replacement = '''{/* Director Overview Dialog */}
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

      '''
        
        content = content[:start_idx] + director_replacement + content[end_idx:]
        print("✅ Director Dialog replaced (~1,430 lines removed)\n")
    else:
        print("⚠️  Director Dialog markers not found\n")
    
    # Replace Area Manager Dialog
    print("🔄 Step 2/3: Replacing Area Manager Dialog...")
    area_start_marker = '{/* Area Manager Overview Dialog */}'
    area_end_marker = '{/* Sales Manager Overview Dialog */}'
    
    start_idx = content.find(area_start_marker)
    end_idx = content.find(area_end_marker)
    
    if start_idx > -1 and end_idx > -1:
        area_replacement = '''{/* Area Manager Overview Dialog */}
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

      '''
        
        content = content[:start_idx] + area_replacement + content[end_idx:]
        print("✅ Area Manager Dialog replaced (~437 lines removed)\n")
    else:
        print("⚠️  Area Manager Dialog markers not found\n")
    
    # Replace Sales Manager Dialog
    print("🔄 Step 3/3: Replacing Sales Manager Dialog...")
    manager_start_marker = '{/* Sales Manager Overview Dialog */}'
    manager_end_marker = '{/* Sales Executive Detail Dialog */}'
    
    start_idx = content.find(manager_start_marker)
    end_idx = content.find(manager_end_marker)
    
    if start_idx > -1 and end_idx > -1:
        manager_replacement = '''{/* Sales Manager Overview Dialog */}
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

      '''
        
        content = content[:start_idx] + manager_replacement + content[end_idx:]
        print("✅ Sales Manager Dialog replaced (~486 lines removed)\n")
    else:
        print("⚠️  Sales Manager Dialog markers not found\n")
    
    # Write fixed file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    new_lines = len(content.split('\n'))
    print("=" * 60)
    print("✨ EMERGENCY FIX COMPLETE!")
    print("=" * 60)
    print(f"📈 New file size: {new_lines} lines")
    print(f"💾 Backup at: {backup_path}")
    print("\n🚀 Now restart your dev server:")
    print("   npm run dev\n")
    print("✅ The 'Failed to fetch module' error should be fixed!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 Make sure you run this from project root directory")
    print("   Example: python3 emergency_fix.py")
