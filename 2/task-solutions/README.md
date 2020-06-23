# Task solutions - Day 2 

For Task 1 refer [notebook](Day2_FibonacciTriangle.ipynb)

For Task 2 refer [notebook](Day2_Permutations.ipynb)

In case of Task 1 the calculation of Fibonacci numbers as per the notebook is done by adding the last and the second last element. There are a lot of other advanced algorithms to do this faster.

**Correction:** The fast doubling method is faster than the recursive method to compute the nth fibonacci number but it is going to be slower when computing an entire series.[link to issue](https://github.com/analytics-club-iitm/Daily-Sessions/pull/3#issuecomment-604295058) 

References to the fast doubling method : [link1](https://chunminchang.github.io/blog/post/calculating-fibonacci-numbers-by-fast-doubling) [link2](https://funloop.org/post/2017-04-14-computing-fibonacci-numbers.html)

**Matrix exponentiation method** :

![matrix](images/matrix.png)

This is a simple identity relating the left matrix with the Fibonnaci sequence. Matrix multiplication is very fast when compared to other techniques but as n increases this increases computation as well.

Hence here comes the **fast doubling method** derived from the matrix exponentation algorithms. 
![fast-doubling](images/fast-doubling.png)

I have benchmarked the results of calculating the nth Fibonacci number using both these methods. Initially till n = 40 the recurisive method is a bit faster but then the fast doubling algorithm becomes exponentially faster. [code implementation](fibonacci-faster.py)

**Results:**

![results](images/fibonacci-faster.png)

Thanks to [@NishantPrabhu](https://github.com/NishantPrabhu) for his detailed notebooks.

