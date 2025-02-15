from random import choices
from string import ascii_uppercase, digits


def create_discount_code(length: int = 20) -> str:
    """
    Creates and returns a random discount code of a given length.

    Args:
        length (int): Determines the length of the discount code to be created.
                      Must be a positive integer.

    Raises:
        ValueError: If `length` is not a positive integer.

    Returns:
        str: The generated discount code.

    Example:
        >>> create_discount_code()
        'TJ0VF-7KDK-DL6U-FN23'
        
        >>> create_discount_code(10)
        'Y83F5-MSK3L'

        >>> create_discount_code(25)
        '8JKD3-KJD9F-DLCKS-JK37D-LSM92'

    """
    
    if not isinstance(length, int):
        raise ValueError(f"The length must be an integer, but got {type(length).__name__}")
    if length <= 0:
        raise ValueError("Length must be a positive integer greater than 0.")
    
    CHARS      = ascii_uppercase + digits
    GROUP_SIZE = 5  

    code = ''.join(choices(CHARS, k=length))
    return '-'.join(code[i:i+GROUP_SIZE] for i in range(0, length, GROUP_SIZE))
