const mergeByKey = (a1, a2) =>
  a1?.map(itm =>
    itm.data
      ? {
          ...itm,
          data: {
            ...itm.data,
            ...a2?.find(item => item.key === itm.data?.key),
          },
        }
      : { ...a2?.find(item => item.key === itm.key), ...itm },
  );

export default mergeByKey;
