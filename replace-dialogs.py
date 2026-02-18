#!/usr/bin/env python3
"""
Script to replace inline dialog components with extracted component calls
in SalesReports.tsx
"""

import re

def replace_dialogs(content: str) -> str:
    """Replace the three large inline dialogs with component calls"""
    
    # 1. Replace Director Dialog (~1,430 lines: 2194-3624)
    director_replacement = """      {/* Director Overview Dialog */}
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

      """
    
    # Replace Director Dialog - from line 2194 to just before Area Manager Dialog (3626)
    pattern1 = re.compile(
        r'{/\* Director Overview Dialog \*/}.*?(?={/\* Area Manager Overview Dialog \*/})',
        re.DOTALL
    )
    content = pattern1.sub(director_replacement, content)
    print("✅ Director Dialog replaced")
    
    # 2. Replace Area Manager Dialog (~435 lines: 3626-4061)
    area_manager_replacement = """      {/* Area Manager Overview Dialog */}
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

      """
    
    pattern2 = re.compile(
        r'{/\* Area Manager Overview Dialog \*/}.*?(?={/\* Sales Manager Overview Dialog \*/})',
        re.DOTALL
    )
    content = pattern2.sub(area_manager_replacement, content)
    print("✅ Area Manager Dialog replaced")
    
    # 3. Replace Sales Manager Dialog (~484 lines: 4063-4547)
    sales_manager_replacement = """      {/* Sales Manager Overview Dialog */}
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

      """
    
    pattern3 = re.compile(
        r'{/\* Sales Manager Overview Dialog \*/}.*?(?={/\* Sales Executive Detail Dialog \*/})',
        re.DOTALL
    )
    content = pattern3.sub(sales_manager_replacement, content)
    print("✅ Sales Manager Dialog replaced")
    
    return content

def main():
    # Read the file
    print("📖 Reading SalesReports.tsx...")
    try:
        with open('/src/app/components/SalesReports.tsx', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ Error: SalesReports.tsx not found!")
        return
    
    original_lines = content.count('\n')
    print(f"   Original: {len(content):,} characters, {original_lines:,} lines")
    
    # Replace dialogs
    print("\n🔄 Replacing dialogs...")
    new_content = replace_dialogs(content)
    
    new_lines = new_content.count('\n')
    lines_reduced = original_lines - new_lines
    chars_reduced = len(content) - len(new_content)
    
    print(f"\n📊 Results:")
    print(f"   New size: {len(new_content):,} characters, {new_lines:,} lines")
    print(f"   Reduced: {chars_reduced:,} characters ({chars_reduced/len(content)*100:.1f}%)")
    print(f"   Reduced: {lines_reduced:,} lines ({lines_reduced/original_lines*100:.1f}%)")
    
    # Write the file
    print("\n💾 Writing updated file...")
    with open('/src/app/components/SalesReports.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("\n✅ SUCCESS! File optimized successfully! 🎉")
    print(f"   SalesReports.tsx is now {lines_reduced:,} lines shorter!")

if __name__ == '__main__':
    main()
