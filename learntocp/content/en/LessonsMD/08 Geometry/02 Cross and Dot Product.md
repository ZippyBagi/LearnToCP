>In this lesson we will learn how to multiply vectors - and why that is really useful

### Dot Product

The dot product is the first way we can multiply vectors. It is written as $\vec{A} \cdot \vec{B}$

It is calculated like this:  $$\vec{A} \cdot \vec{B} = \vec{A}_x * \vec{B}_x + \vec{A}_y * \vec{B}_y$$
It is useful because it tells us if two vectors are **normal to each other**.

#### Normal vectors

Normal vectors are vectors that form an **angle of 90°**

If the dot product of 2 vectors is `0`, then they are normal to each other.

	![[dot-product-normal.png]]

#### Implementation
Assume that all vectors are implemented like this: 
~!
```c++
struct v{
	long long x;
	long long y;
};
```

The dot product is:
~!
```c++
int dot_product(v a, v b){
    return (a.x * b.x) + (a.y * b.y);
}
```

### Cross Product

The second, and more useful way of multiplying is the cross product.

We can use it to calculate whether a polygon is convex or not, are two vectors parallel? Is there an intersection between two vectors?, etc..

The cross product for two 2D vectors simplifies down to calculating the determinant of their coordinates. It is written as $A \times B$

Which means:

$$\vec{A} \times \vec{B} = \vec{A}_x * \vec{B}_y - \vec{A}_y * \vec{B}_x$$
The sign of the cross product tells us where two vectors are relative to each other.

#### Reading the Cross Product

Imagine the vectors are intersecting a circle.

When we do the cross product of $\vec{A} \times \vec{B}$, if the product is **positive**, then on the circle, to get from $\vec{A}$ to $\vec{B}$ we move counter-clockwise.

If the product is **negative**, to get from $\vec{A}$ to $\vec{B}$ ,we move clock-wise.

If the product is `0`, then $\vec{A}$ and $\vec{B}$ are **parallel**!

	![[cross-product-circle.png]]

#### Implementation

```c++
int cross_product(v a, v b){

    return (a.x * b.y) - (a.y * b.x);
}
```