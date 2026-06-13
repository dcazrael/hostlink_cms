# Storybook feedback

## This is a "living" document I maintain to give feedback to the storybook stories

## We should switch from random components to shadCnUi

This allows us to have great access to functionality and we can style them however we want.
I already switched the components we use for the most part. at least there is no radixUi left.

## Story categories

- Primitives: base components like buttons, input, textarea, checkbox/label, select, pagination.
- Patterns: visual choices like chamfered cards, bullets, shapes, masks, frames.
- Compositions: primaries and patterns combined into larger UI pieces, e.g. pricing cards.

Most stories should expose controls where practical.

## Paterns

Now we get to the patterns.

there is many things wrong with them, because they are trying to mimik the pamphlet but not properly

### Pricing Cards

These are completely wrong.
The pricing cards are in the pamphlet on page 9

### Flow

This is a mix of the current implementation with the numbers and Page 5.
Please ask me if you don't understand

### FAQ

This should be implemented as Accordion from ShadCN/UI
currently just a detail and summary.
If it's implemented from ShadCN I can run my preset and it will use the correct (or at least the closest) styling I like

### Tables

there should be 2 patterns

#### Pattern 1

Page 2 in the Pamphlet

#### Pattern 2

the currently shown pattern, but with controls

### Contact Form

that one is the code that is currently existent.
You should check how that is implemented.

### Bulleted List

Can stay, however also with controls

### Image Frames

This makes no sense for me.
This is also a bit complex I think.

Multiple patterns

#### Pattern 1

Pamphlet page 4
It's an overlay and a clippath combined

#### Pattern 2

Like now, but that as a clippath

#### Pattern 3

Pamphlet page 1
Overlays and a clippath
The overlays here are the navy colored shapes.

### Section Shapes

with this I actually meant shapes that span the entire section, like pamphlet page 8 and 9
the current shape can be included as well, just BIGGER.
and as usuall controls

### Section with Image

seems like a hero? If so, the pattern is wrong.
The hero for a page would be similar to page 1 in the pamphlet.
Large shape with text on it and the image is then masked with a clippath

here you probably also need to consult me, since I know roughly how I would build it in HTML
