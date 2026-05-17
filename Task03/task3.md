### 1. Why are we using clamp instead of media queries?

clamp() creates fluid sclaing and allows properties like font-size or padding to resize smoothly and continuously as the window moves.

---


### 2. Why did we use minmax instead of fixed columns?

Because it creates a flexible grid. This allows items to wrap to a new row automatically on small screens without needing extra code.

---


### 3. Why is it important to implement a mobile-first? website?

Because it is better for performance and efficiency, since it loads the simplest code first and it is easier to add layout complexity as screens get larger.

---


### 4. What happens if we remove the variables that were defined at the beginning?

If they are removed, most of the elements will go back to their default colors and the spacings that use --space will collapse to 0 or browser defaults. This will make the layout look cluttered and broken.