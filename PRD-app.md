# Career Pivot Helper - Product Requirements Document

A professional skill translation tool that helps users modernize their experience and navigate career transitions with confidence.

**Experience Qualities**:
1. **Empowering** - Users should feel confident about their transferable skills and future opportunities
2. **Insightful** - Provides clear, actionable connections between old and new skills with practical context
3. **Professional** - Maintains a sophisticated, trustworthy aesthetic that respects users' career expertise

**Complexity Level**: Light Application (multiple features with basic state)
- The app provides skill translation, saves user profiles, and offers career guidance without requiring complex account management or advanced workflows.

## Essential Features

### Skill Translation Engine
- **Functionality**: Converts outdated/legacy skills into modern, relevant equivalents with detailed explanations
- **Purpose**: Helps users understand how their existing expertise translates to current market demands
- **Trigger**: User enters an old skill or technology they've worked with
- **Progression**: Input legacy skill → AI analysis → Modern equivalent suggestions → Detailed translation with market context → Save to profile
- **Success criteria**: Users receive 3-5 relevant modern skills with explanations of transferability and market demand

### Personal Skill Portfolio
- **Functionality**: Saves translated skills, allows editing, and builds a comprehensive modern skill profile
- **Purpose**: Creates a persistent record of translated skills for resume building and career planning
- **Trigger**: User chooses to save a translated skill or wants to review their portfolio
- **Progression**: View portfolio → Edit/remove skills → Export or copy formatted list → Share or use for applications
- **Success criteria**: Users can maintain and export a clean, professional list of modernized skills

### Career Path Suggestions
- **Functionality**: Recommends potential career directions based on translated skill profile
- **Purpose**: Provides concrete next steps and career transition guidance
- **Trigger**: User has built a portfolio of translated skills and requests career guidance
- **Progression**: Analyze skill portfolio → Generate career path recommendations → Provide learning resources → Action planning
- **Success criteria**: Users receive 3-4 specific career path suggestions with clear steps for transition

### Skill Gap Analysis
- **Functionality**: Identifies missing skills needed for target roles and suggests learning priorities
- **Purpose**: Creates actionable learning roadmap for career transition
- **Trigger**: User selects a target career path or job role
- **Progression**: Select target role → Compare current skills → Identify gaps → Prioritize learning → Resource recommendations
- **Success criteria**: Users get a clear, prioritized list of skills to develop with learning resources

## Edge Case Handling
- **Very Niche Skills**: Provide general transferable principles when direct translations don't exist
- **Extremely Outdated Technology**: Focus on underlying concepts and problem-solving approaches rather than technical specifics
- **Ambiguous Input**: Ask clarifying questions about context and specific experience level
- **No Clear Modern Equivalent**: Emphasize transferable soft skills and foundational knowledge
- **Multiple Career Interests**: Allow users to explore different translation contexts for the same skills

## Design Direction
The design should feel sophisticated and professional like a high-end career consultancy - trustworthy, modern, and empowering. Clean lines, generous white space, and thoughtful typography that conveys expertise and reliability while maintaining approachability.

## Color Selection
### Palette

| Name | Hex | Role | Typical Usage |
| --- | --- | --- | --- |
| Midnight Navy | #2C3E50 | Primary | Headers, primary buttons, icons, key text, navigation |
| Elegant Lavender | #C8A2C8 | Secondary | Accents, badges, tags, secondary buttons, highlights |
| Ivory Glow | #FDF5E6 | Background | App background, surfaces, cards, section fills |
| Rosewood Red | #9B2335 | Accent (Destructive) | Destructive actions, error states, warnings, critical highlights |

### Scheme Definition
- Primary (Core brand): Midnight Navy (#2C3E50)
  - Primary button background, header text, key icons. Text on primary uses white for contrast.
- Secondary (Support/accents): Elegant Lavender (#C8A2C8)
  - Secondary buttons, chips/badges, subtle highlights, charts accents.
- Background (Canvas/surfaces): Ivory Glow (#FDF5E6)
  - Page background, card backgrounds, section dividers. Use subtle borders/shadows for separation.
- Accent/Destructive (Feedback/alerts): Rosewood Red (#9B2335)
  - Delete/danger actions, error toasts, form validation errors. Text on this color uses white.

### Accessibility & Contrast
- Ensure body text on Ivory Glow uses Midnight Navy for AA contrast.
- Primary/Destructive buttons should use white label text and pass AA contrast against their backgrounds.
- Avoid long paragraphs on Rosewood Red or Elegant Lavender; use them for emphasis, not body copy.


## Font Selection
Typography should convey professionalism and clarity - modern sans-serif that feels approachable yet authoritative, suitable for both headers and body text in a career context.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing
  - H3 (Subsections): Inter Medium/18px/normal spacing
  - Body (Main Text): Inter Regular/16px/relaxed line height
  - Small (Labels/Meta): Inter Medium/14px/tight line height

## Animations
Subtle and purposeful animations that enhance the professional experience without being distracting - smooth transitions that reinforce the feeling of progress and transformation.

- **Purposeful Meaning**: Gentle fade-ins for skill suggestions convey thoughtful analysis, sliding transitions for navigation suggest forward progress in career development
- **Hierarchy of Movement**: Skill translation results deserve prominent animation focus, while navigation and form interactions use minimal, smooth transitions

## Component Selection
- **Components**: Card for skill displays, Dialog for detailed skill explanations, Form for skill input, Button for primary actions, Badge for skill tags, Tabs for portfolio sections, Alert for helpful tips
- **Customizations**: Custom skill comparison component showing before/after skill translations, progress indicators for skill portfolio completion
- **States**: Buttons show clear loading states during AI processing, input fields provide immediate validation feedback, cards have subtle hover states
- **Icon Selection**: ArrowRight for skill translation direction, Briefcase for career paths, BookOpen for learning resources, Plus for adding skills
- **Spacing**: Consistent 4-unit spacing (16px) between major sections, 2-unit (8px) for related elements, generous padding in cards (24px)
- **Mobile**: Single-column layout with full-width cards, collapsible sections for portfolio management, floating action button for quick skill translation