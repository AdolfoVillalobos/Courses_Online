import numpy as np
import matplotlib.pyplot as plt
import random


class Bandit():

    def __init__(self, m):
        self.m = m
        self.lambda0 = 1
        self.tau = 1
        self.m0 = 0
        self.sum_x = 0

    def pull(self):
        return np.random.randn() + self.m

    def sample(self):
        return np.random.randn()/np.sqrt(self.lambda0)+self.m0

    def update(self, x):
        self.lambda0 += 1
        #print(x)
        self.sum_x += x
        self.m0 = self.tau*self.sum_x/self.lambda0

        #print(self.mean)

def run_experiment(m1, m2, m3, eps, N):
    bandits = [Bandit(m1), Bandit(m2), Bandit(m3)]
    data = np.empty(N)
    for t in range(N):

        updated_bandit = np.argmax([bandit.sample() for bandit in bandits])

        reward = bandits[updated_bandit].pull()
        bandits[updated_bandit].update(reward)

        data[t] = reward
    cumulative_average = np.cumsum(data)/ (np.arange(N)+1)
    plt.plot(cumulative_average, label='cum_average')
    plt.plot(np.ones(N)*m1, label='m1')
    plt.plot(np.ones(N)*m2, label='m2')
    plt.plot(np.ones(N)*m3, label='m3')
    plt.title("E-greedy eps={}".format(eps))
    plt.xscale('log')
    plt.legend()
    plt.show()

    for b in bandits:
        print(b.sample())
    return cumulative_average

if __name__ == '__main__':

    c_1 = run_experiment(1.0, 2.0, 3.0, 0.1, 100000)
    c_05 = run_experiment(1.0, 2.0, 3.0, 0.05, 100000)
    c_01 = run_experiment(1.0, 2.0, 3.0, 0.01, 100000)

    plt.plot(c_1, label='eps=0.1')
    plt.plot(c_05, label='eps=0.05')
    plt.plot(c_01, label='eps=0.01')
    plt.xscale('log')
    plt.legend()
    plt.show()
