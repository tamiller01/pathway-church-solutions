# Pathway Church Solutions — Component Library
A unified component specification for building all UI elements in the Pathway Church Solutions application.  
Use this document when generating components with GitHub Copilot Chat.

---

## 1. Buttons

### PrimaryButton
**Purpose:** Main call-to-action  
**Styles:**
- Height: 56px  
- Width: auto (280px desktop, full-width mobile)  
- Background: brand.gold  
- Text: brand.navy, 20px bold  
- Radius: 12px  
- Shadow: soft  
- Padding: 16px left/right  

**States:**
- Hover: darken gold by 10%  
- Focus: 2px gold outline  
- Active: compress shadow  
- Disabled: 40% opacity  

---

### SecondaryButton
**Purpose:** Secondary actions  
**Styles:**
- Background: transparent  
- Border: 2px brand.navy  
- Text: brand.navy, 20px medium  
- Height: 56px  
- Radius: 12px  

**States:**
- Hover: navy background at 10% opacity  
- Focus: 2px gold outline  
- Disabled: 40% opacity  

---

### TextButton
**Purpose:** Inline actions  
**Styles:**
- Text: brand.navy  
- Font: 18px medium  

**States:**
- Hover: underline + gold tint  
- Active: gold text  

---

## 2. Inputs

### TextInput
**Styles:**
- Height: 56px  
- Background: neutral.white  
- Border: 1px neutral.grayLight  
- Radius: 16px  
- Padding: 16px  
- Text: brand.navy  
- Placeholder: neutral.grayLight  

**States:**
- Focus: 2px gold outline  
- Error: border error red (#C94A4A)  
- Disabled: warmLight background + 40% opacity  

---

### Textarea
**Styles:**
- Min height: 120px  
- Same styling as TextInput  
- Resizable: vertical only  

---

## 3. Cards

### StandardCard
**Purpose:** General content blocks  
**Styles:**
- Background: neutral.white  
- Border: 1px neutral.grayLight  
- Radius: 16px  
- Shadow: medium  
- Padding: 24px  

---

### SectionCard
**Purpose:** Section-level grouping (worship, sermon, discipleship)  
**Styles:**
- Background: neutral.warmLight  
- Radius: 16px  
- Padding: 32px  
- Shadow: none  

---

### InteractiveCard
**Purpose:** Selectable items (songs, presets, templates)  
**Styles:**
- Background: neutral.white  
- Border: 2px transparent  
- Radius: 16px  
- Shadow: soft  
- Padding: 24px  

**States:**
- Hover: shadow.medium  
- Selected: border brand.gold + shadow.deep  

---

## 4. Headers

### PageHeader
**Styles:**
- Title: H1 (48px bold navy)  
- Subhead: Body Large (20px slate)  
- Spacing: 24px below title  

---

### SectionHeader
**Styles:**
- Title: H2 (32px bold navy)  
- Accent: 4px gold underline  
- Spacing: 24px  

---

### SubsectionHeader
**Styles:**
- Title: H3 (22px bold navy)  
- Spacing: 16px  

---

## 5. Navigation

### TopNav
**Styles:**
- Height: 80px  
- Background: neutral.white  
- Logo left, nav links right  
- Links: navy, 18px medium  
- Spacing: 40px between links  

**Mobile:**
- Hamburger menu  
- Slide-in panel  

---

### Footer
**Styles:**
- Background: brand.navy  
- Padding: 40px  
- Links: white, 18px medium  
- Tagline: 16px light white  

---

## 6. Modals

### Modal
**Styles:**
- Background: neutral.white  
- Radius: 24px  
- Shadow: deep  
- Padding: 40px  
- Overlay: rgba(0,0,0,0.4)  

---

## 7. Tabs

### Tabs
**Styles:**
- Active: gold underline  
- Inactive: slate text  
- Padding: 16px  

---

## 8. Accordions

### Accordion
**Styles:**
- Header: 20px medium navy  
- Icon: gold chevron  
- Content: body.md  
- Border: neutral.grayLight  
- Radius: 12px  

---

## 9. Media Components

### ScreenshotFrame
**Styles:**
- Background: neutral.white  
- Border: 1px neutral.grayLight  
- Radius: 16px  
- Shadow: medium  
- Max width: 520px desktop, 420px tablet, full mobile  

---

## 10. Layout Components

### HeroSection
**Styles:**
- Background: slateBlue gradient  
- Text: white  
- Padding: 140px top, 160px bottom  
- Centered vertical stack  

---

### TwoColumnSection
**Styles:**
- Desktop: 50/50 split  
- Tablet: 50/50 with stacked text  
- Mobile: stacked vertically  

---

### FeatureGrid
**Styles:**
- Desktop: 3 columns  
- Tablet: 2 columns  
- Mobile: 1 column  
- Icons: 48px navy outline  
- Titles: 22px bold navy  
- Body: 18px slate  

---

# End of Component Library
