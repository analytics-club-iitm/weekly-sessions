# all import statements.
import numpy as np
import random
from scipy.signal import convolve2d
from matplotlib.animation import FuncAnimation
import matplotlib.pyplot as plt

# class conways for handling all the variables and functions related to a conways cycle.
class conways():
    # the init function is like the constructor for this class which will get called when we create an object of this class.
    # the self argument is passed which acts as an instance of the class to access its variables.
    def __init__(self,rows,columns):
        # defining the basic arguments of the conways grid the number of rows and columns.
        self.rows = rows
        self.columns = columns
        self.grid = np.zeros((rows,columns))

    # I have made some points files called 1.txt 2.txt which are basically locations of points which are alive and which are not.
    # This is to make those interesting patterns and also for your reference to handle files.
    # the ref point is the point from which we will recreate the pattern from the file.
    def initialise(self, file, ref_point):
        # opening these files.
        f = open(file)
        i = 0
        # going through the file line by line.
        for line in f:
            # removing all spaces and escape sequences in a line
            line = line.replace(" ","")
            line = line.replace("\n","")
            # if the line is empty then it means we must go the next row
            if line == "":
                i = i+1
                continue
            # going through the line and hence choosing the cells in that particular row. 0 means alive and . means dead.
            j = 0
            for char in line:
                if char == "O":
                    self.grid[ref_point + i][ref_point + j] = 1
                j = j+1
            i = i+1

    # this function is to randomly choose a fraction of points in the region of interest represented by
    # rows_roi and columns_roi
    def initialise_random(self,fraction,rows_roi,columns_roi):
        # randomly choosing a row and column index from the given region of interest and making them alive.
        for i in range(int(fraction*self.rows*self.columns)):
            self.grid[random.randint(rows_roi[0],rows_roi[1])][random.randint(columns_roi[0],columns_roi[1])] = 1

    # creating a matrix to find the number of alive neighbours to every cell.
    def cal_neighbours(self):
        return convolve2d(self.grid, np.ones((3, 3), dtype=int), 'same') - self.grid
        """
        shorter way -
        weight = np.asarray([[1,1,1],[1,0,1][1,1,1]])
        convolve2d(self.grid, a, 'same')
        """

    # updating the grid every timestep based on the given rules.
    def update_grid(self):
        # copying the actual grid to temp grid so that as we cycle through every point we can make the changes to the temp grid
        # and still retain the grid for the previous time step in self.grid. After the locations of the next time step is formed,
        # it is updated to self.grid. Directly equating two matrices lead to sharing the same object and hence to avoid this we use np.copy()

        temp_grid = np.copy(self.grid)
        # calculate the neighbour matrix - number of alive neighbours around every cell.
        neighbours = self.cal_neighbours()

        # going through the the entire grid matrix and checking for alive and dead cells and also checking the neighbour matrix.
        # Based on these, the new grid is updated.
        for i in range(self.rows):
            for j in range(self.columns):
                # if the cell in alive in the previous time step
                if self.grid[i][j] == 1:
                    # if the number of alive neighbours around it is 2 or 3 then it survives
                    if neighbours[i][j] == 2 or neighbours[i][j] == 3:
                        temp_grid[i][j] = 1
                    # if not then dead either because of over or under population.
                    else:
                        temp_grid[i][j] = 0
                # if a cell was dead.
                if self.grid[i][j] == 0:
                    # if the number of alive neighbours around it is 3 then make it alive in the next time step.
                    if neighbours[i][j] == 3:
                        temp_grid[i][j] = 1

        # update grid with the next timestep
        self.grid = temp_grid

# creating an object of the conways class.
conw = conways(200,200)
# using the text file
conw.initialise("data/1.txt",150)
# for random intialisation.
# conw.initialise_random(0.3, (0,50),(0,50))
# creating an empty figure and axes
fig, ax = plt.subplots()
# imshow the intial grid.
img = ax.imshow(conw.grid, interpolation='nearest')

# creating the update function, argument i is automatically passed onto the function by FuncAnimation - generally denoting which frame it is currently at.
def update(i):
    # calling update grid function from conways class and updating the grid for the next timestep.
    conw.update_grid()
    # setting the new grid as the data for the matplotlib figure
    img.set_data(conw.grid)
    # returning the newly set matplotlib object
    return img,

# func animation for animating in matplotlib. arguments are the figure, update function and the number of frames.
ani = FuncAnimation(fig, update,frames=10000)
# plt.show for showing the frames.
plt.show()
