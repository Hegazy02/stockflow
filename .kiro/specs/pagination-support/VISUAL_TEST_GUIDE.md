# Visual Pagination Test Guide

## 🎨 What to Look For - Visual Checklist

This guide shows you exactly what to look for when testing pagination visually.

---

## ✅ Test 1: Initial Page Load

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Product Table with 10 rows]                                │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Showing 1-10 of 50                                          │
│  [◄◄] [◄] [1] [2] [3] [4] [5] [►] [►►]  Items per page: [10▼]│
└─────────────────────────────────────────────────────────────┘
```

### URL Should Show:
```
http://localhost:4200/products?page=1&limit=10
```

### Checklist:
- [ ] Table shows exactly 10 products
- [ ] Pagination shows "Showing 1-10 of X"
- [ ] Page 1 is highlighted/active
- [ ] URL contains `?page=1&limit=10`
- [ ] First/Previous buttons are disabled
- [ ] Next/Last buttons are enabled

---

## ✅ Test 2: Click Next Page

### Action:
Click the "Next" button [►]

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Product Table with DIFFERENT 10 rows]                      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Showing 11-20 of 50                                         │
│  [◄◄] [◄] [1] [2] [3] [4] [5] [►] [►►]  Items per page: [10▼]│
└─────────────────────────────────────────────────────────────┘
```

### URL Should Change To:
```
http://localhost:4200/products?page=2&limit=10
```

### Checklist:
- [ ] Products changed (different products displayed)
- [ ] Pagination shows "Showing 11-20 of X"
- [ ] Page 2 is now highlighted/active
- [ ] URL updated to `?page=2&limit=10`
- [ ] All navigation buttons are enabled
- [ ] Brief loading indicator appeared

---

## ✅ Test 3: Change Page Size

### Action:
Click dropdown and select "20"

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Product Table with 20 rows - MORE ROWS VISIBLE]           │
│                                                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Showing 1-20 of 50                                          │
│  [◄◄] [◄] [1] [2] [3] [►] [►►]  Items per page: [20▼]       │
└─────────────────────────────────────────────────────────────┘
```

### URL Should Change To:
```
http://localhost:4200/products?page=1&limit=20
```

### Checklist:
- [ ] Table now shows 20 products
- [ ] Pagination shows "Showing 1-20 of X"
- [ ] Page reset to 1 (page 1 is highlighted)
- [ ] URL updated to `?page=1&limit=20`
- [ ] Fewer total pages shown (e.g., 3 instead of 5)
- [ ] Dropdown shows "20"

---

## ✅ Test 4: Last Page

### Action:
Click "Last Page" button [►►]

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Product Table with remaining rows - may be < 20]          │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Showing 41-50 of 50                                         │
│  [◄◄] [◄] [1] [2] [3] [►] [►►]  Items per page: [20▼]       │
└─────────────────────────────────────────────────────────────┘
```

### URL Should Change To:
```
http://localhost:4200/products?page=3&limit=20
```

### Checklist:
- [ ] Shows last set of products (may be less than page size)
- [ ] Pagination shows "Showing 41-50 of 50" (or similar)
- [ ] Last page is highlighted
- [ ] URL shows last page number
- [ ] Next/Last buttons are disabled
- [ ] Previous/First buttons are enabled

---

## ✅ Test 5: Browser Back Button

### Action:
Click browser's back button ←

### What You Should See:
- URL changes back to previous page
- Products reload for that page
- Pagination controls update
- Brief loading indicator

### Checklist:
- [ ] URL reverted to previous state
- [ ] Products match the URL page
- [ ] Pagination controls match URL
- [ ] No errors in console

---

## ✅ Test 6: Page Refresh

### Action:
Press F5 or Ctrl+R

### What You Should See:
- Page reloads completely
- Same products displayed
- Same pagination state
- URL unchanged

### Checklist:
- [ ] URL stayed the same
- [ ] Same page of products displayed
- [ ] Pagination controls show same state
- [ ] No errors in console

---

## ✅ Test 7: Loading State

### What to Look For During Page Change:

```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Loading Spinner or Skeleton]                       │   │
│  │  Loading...                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Showing X-Y of Z                                            │
│  [◄◄] [◄] [1] [2] [3] [►] [►►]  Items per page: [10▼]       │
│  (All buttons disabled/grayed out)                           │
└─────────────────────────────────────────────────────────────┘
```

### Checklist:
- [ ] Loading indicator visible
- [ ] Pagination buttons disabled
- [ ] Page size dropdown disabled
- [ ] Loading clears when data arrives
- [ ] Duration < 1 second (typically)

---

## ✅ Test 8: Empty State

### Scenario: No products or filter returns nothing

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    📦                                         │
│              No products found                               │
│                                                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  (No pagination controls visible)                            │
└─────────────────────────────────────────────────────────────┘
```

### Checklist:
- [ ] Empty state message displayed
- [ ] Pagination controls hidden
- [ ] No "Showing X-Y of Z" text
- [ ] No errors in console

---

## ✅ Test 9: Error State

### Scenario: API error or network failure

### What You Should See:
```
┌─────────────────────────────────────────────────────────────┐
│  Products List                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    ⚠️                                         │
│         Failed to load products                              │
│         [Retry Button]                                       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Showing X-Y of Z                                            │
│  [◄◄] [◄] [1] [2] [3] [►] [►►]  Items per page: [10▼]       │
└─────────────────────────────────────────────────────────────┘
```

### Checklist:
- [ ] Error message displayed
- [ ] Retry button available
- [ ] Previous data maintained (if any)
- [ ] Pagination controls may be disabled
- [ ] Error details in console (for debugging)

---

## 🎯 Quick Visual Verification (2 minutes)

### The "Smoke Test"
1. **Load page** → See 10 products, page 1, URL has `?page=1&limit=10`
2. **Click next** → See different products, page 2, URL has `?page=2&limit=10`
3. **Change to 20** → See 20 products, page 1, URL has `?page=1&limit=20`
4. **Press F5** → Same state maintained
5. **Click back** → Returns to previous state

If all 5 pass → Pagination is working! ✅

---

## 🔍 What to Check in Browser DevTools

### Network Tab
```
Request URL: http://localhost:3000/api/products?page=2&limit=10
Request Method: GET
Status Code: 200 OK

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 2,
    "limit": 10,
    "pages": 5
  }
}
```

### Console Tab
Should be clean - no errors!
```
✓ No red errors
✓ No warnings (or only expected warnings)
✓ Redux actions logged (if DevTools installed)
```

### Redux DevTools (if installed)
```
State → products → pagination:
{
  total: 50,
  page: 2,
  limit: 10,
  pages: 5
}

Actions:
- [Products] Change Page
- [Products] Load Products
- [Products] Load Products Success
```

---

## 📱 Mobile View Check

### What to Verify:
```
┌─────────────────────┐
│  Products List      │
│  [+ New]            │
├─────────────────────┤
│                     │
│  [Product Cards]    │
│  [Stacked]          │
│                     │
├─────────────────────┤
│  Showing 1-10 of 50 │
│  [◄] [1][2][3] [►]  │
│  Per page: [10▼]    │
└─────────────────────┘
```

### Checklist:
- [ ] Pagination controls visible
- [ ] Buttons are tappable (not too small)
- [ ] Dropdown works on mobile
- [ ] No horizontal scrolling
- [ ] Text is readable

---

## 🎨 Visual Indicators to Look For

### Active Page
```
[1] [2] [3]  →  Page 2 should be:
    ^^^         - Different color (highlighted)
                - Bold text
                - Or underlined
```

### Disabled Buttons
```
On page 1:
[◄◄] [◄]  →  Should be:
             - Grayed out
             - Not clickable
             - Cursor shows "not-allowed"
```

### Loading State
```
During load:
- Spinner icon rotating
- Or skeleton placeholders
- Or "Loading..." text
- Buttons disabled
```

### Hover States
```
When hovering over buttons:
- Color change
- Cursor changes to pointer
- Slight animation/transition
```

---

## ❌ Common Visual Issues to Watch For

### Issue 1: Flickering
**Problem:** Table flickers when changing pages
**Expected:** Smooth transition with loading overlay

### Issue 2: Wrong Data
**Problem:** Page 2 shows same products as page 1
**Expected:** Different products on each page

### Issue 3: URL Not Updating
**Problem:** URL stays at `?page=1` when clicking page 2
**Expected:** URL updates to `?page=2&limit=10`

### Issue 4: Pagination Hidden
**Problem:** Pagination controls not visible
**Expected:** Controls visible when totalRecords > 0

### Issue 5: Wrong Count
**Problem:** Shows "Showing 1-10 of 10" when there are 50 products
**Expected:** Shows "Showing 1-10 of 50"

---

## 📸 Screenshot Checklist

Take screenshots of:
1. [ ] Initial page load (page 1)
2. [ ] Page 2 after clicking next
3. [ ] Page size changed to 20
4. [ ] Last page
5. [ ] Loading state
6. [ ] Empty state
7. [ ] Error state
8. [ ] Mobile view

Save to: `.kiro/specs/pagination-support/screenshots/`

---

## ✨ Accessibility Check

### Keyboard Navigation
- [ ] Tab through pagination controls
- [ ] Enter/Space activates buttons
- [ ] Focus indicators visible
- [ ] Logical tab order

### Screen Reader
- [ ] Page changes announced
- [ ] Button labels are descriptive
- [ ] Current page is announced
- [ ] Total pages announced

---

## 🎯 Pass/Fail Criteria

### ✅ PASS if:
- All visual elements display correctly
- URL updates on every change
- Data matches the page number
- Loading states appear and clear
- No console errors
- Browser navigation works
- Page refresh maintains state

### ❌ FAIL if:
- Pagination controls missing
- URL doesn't update
- Wrong data displayed
- Console errors present
- Browser back/forward broken
- Page refresh loses state
- Loading state never clears

---

**Use this guide alongside:** [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)

**For technical details, see:** [PAGINATION_FLOW_GUIDE.md](./PAGINATION_FLOW_GUIDE.md)

