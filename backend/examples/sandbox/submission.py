def findTwoSum(numbers, target):
    # answer 1
    # for i in range(len(numbers)):
    #     for j in range(i + 1, len(numbers)):
    #         if numbers[i] + numbers[j] == target:
    #             return [i, j]
    # return None

    # answer 2
    # while True:
    #     pass

    # answer 3
    my_dict = {}
    for i, num in enumerate(numbers):
        if target - num in my_dict:
            return [my_dict[target - num], i]
        my_dict[num] = i

    return None
