# Day 3 

Hey Guys hope you were able to complete the tasks in Day 2, if you are facing some issues feel free to put it up on the issues tab.

So today we will be looking at two very important libraries in Python - Numpy and Matplotlib.

Numpy is a python library used to handle matrices and Matplotlib is a visualisation library.

Both these libraries will be used a lot whenever you code in Python be it for Data science or Deep Learning or whatsoever.

## Links to the Notebooks

- **Numpy** [link](NumPy.ipynb)
- **Matplotlib** [link](matplotlib.ipynb)
- **Some cool visualisation examples** [link](cool_vis.ipynb)

I suggest you guys to spend enough time on these topics and try to complete the tasks we give today. We would love to help you out incase of any difficulties.

## Task - an interesting one.

**Conway's way of life** is a simple and yet interesting game. Consider a 2d array of pixels out of which a some of them are randomly sampled and are called "alive" and the remaining are called "Dead". Now we look at each cell and look at its neighbours.

**Rules:**

- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

**Now if we use these rules and model the 2d pixel array we can see some very interesting patterns based on how one starts the life cycle**.

![conways-1](data/conways.gif)

![conways-2](data/conways-2.gif)

**I want you all to think whats the best way to find the neighbours of every cell.**

### Also it would be great if you could all post your output videos and code as a pull request as then we can get some really cool and different patterns.


