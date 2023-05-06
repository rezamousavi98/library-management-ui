import {useState, useEffect} from 'react';
import { appConfig } from "@/configs";
import { Tables } from '@/widgets/tables';
export const Members = () => {
    const apiUrl = appConfig.baseApiUrl + 'members/';
    const [members, setMembers] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(false);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    
    const tableColumns = [
        { type: "text", name: "fullName", label: "Full Name" },
        { type: "text", name: "nationalCode", label: "National Code" },
        { type: "text", name: "mobile", label: "Mobile No." },
        { type: "text", name: "address", label: "Address" },
        { type: "date", name: "registeredAt", label: "Registered At" },
    ];

    useEffect(() => {
        const getMembers = async () => {
          const membersFromApi = await fetchMembers();
          setMembers(membersFromApi);
        };
        getMembers();
      }, [page]); //eslint-disable-line react-hooks/exhaustive-deps

    // const addProduct = async (product) => {
    //     setAddIsPending(true);
    //     await fetch(apiUrl, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": "Bearer " + token
    //         },
    //         body: JSON.stringify(product),
    //       })
    //         .then((response) => {
    //           if (response.ok) {
    //             return response.json();
    //           } else {
    //             alert('عملیات با خطا مواجه شد');
    //           }
    //         })
    //         .then((responseResult) => {
    //           setAddIsPending(false);
    //           const newProductsList = [
    //             ...products,
    //             {
    //               ...responseResult.result,
    //               category: categories[responseResult.result.category],
    //             },
    //           ];
    //           const newCount = count + 1;
    //           setCount(newCount);
    //           if (newProductsList.length <= pageSize) {
    //             setProducts(newProductsList);
    //           } else {
    //             setPage(Math.ceil(newCount / pageSize));
    //             setPageSize(pageSize);
    //           }
    //         });
    // }

    const fetchMembers = async () => {
        setIsPending(true);
        const response = await fetch(`${apiUrl}?page=${page}&limit=${pageSize}`);
        if (response.ok) {
          const data = await response.json();
          setIsPending(false);
          setError(false);
          setCount(data.result.count);
          return data.result.results;
        } else {
          setError(true);
          setIsPending(false);
          setCount(0);
          return [];
        }
      };

    //   const deleteProduct = async (id) => {
    //     await fetch(`${apiUrl}/${id}`, {
    //         method: "DELETE",
    //         headers: {
    //           "Authorization": "Bearer " + token
    //         }
    //       });
    //       const leftProducts = products.filter((item) => item._id !== id);
    //       setProducts(leftProducts);
    //       if (leftProducts.length === 0) {
    //         if (page > 1) {
    //           setPage(page - 1);
    //           setPageSize(pageSize);
    //         }
    //         setCount(count > 0 ? count - 1 : 0);
    //       } else {
    //         setPage(page);
    //         setPageSize(pageSize);
    //         setCount(count > 0 ? count - 1 : 0)
    //       }
    //   }

    //   const onDelete = (id) => {
    //     const confirmed = window.confirm("آیا اطمینان دارید؟");
    //     if (confirmed) {
    //       deleteProduct(id);
    //     } else {
    //       return;
    //     }
    //   };

    //   const changePage = (page, pageSize)  => {
    //     setPage(page);
    //     setPageSize(pageSize);
    //   }

    const onPageChange = (page) => {
      setPage(page);
    }

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Tables
          title="Members"
          data={members}
          columns={tableColumns}
          actions={[]}
          hasPaging={true}
          count={count}
          onPageChange={onPageChange}
          pageSize={pageSize}
          currentPage={page}
          loading={isPending}
        />
      </div>
    );
}