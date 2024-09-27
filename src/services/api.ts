/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ChangePassword {
  /**
   * Old password
   * @minLength 1
   */
  old_password: string
  /**
   * New password
   * @minLength 1
   */
  new_password: string
}

export interface Login {
  /**
   * Email
   * @format email
   * @minLength 1
   */
  email: string
  /**
   * Password
   * @minLength 1
   */
  password: string
}

export type Logout = object

export interface TokenRefresh {
  /**
   * Refresh
   * @minLength 1
   */
  refresh: string
  /**
   * Access
   * @minLength 1
   */
  access?: string
}

export interface AddToCart {
  /** Product id */
  product_id: number
  /**
   * Quantity
   * @min 1
   */
  quantity: number
}

export interface OrderItem {
  /** ID */
  id?: number
  /** Product */
  product: number
  /**
   * Quantity
   * @min 0
   * @max 4294967295
   */
  quantity: number
  /**
   * Price at purchase
   * @format decimal
   */
  price_at_purchase?: string
}

export interface Order {
  /** ID */
  id?: number
  /** User */
  user?: number
  /** Status */
  status?: 'pd' | 'sb' | 'pr' | 'de' | 'cp' | 'df' | 'cn'
  /** Total price */
  total_price?: string
  /**
   * Address
   * @minLength 1
   */
  address?: string
  items?: OrderItem[]
}

export interface AddOrderItem {
  /** Product */
  product: number
  /**
   * Quantity
   * @min 1
   */
  quantity: number
}

export interface OrderStatusUpdate {
  /** Status */
  status?: 'pd' | 'sb' | 'pr' | 'de' | 'cp' | 'df' | 'cn'
}

export interface Category {
  /** ID */
  id?: number
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /**
   * Slug
   * @format slug
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug?: string
}

export interface Product {
  /** ID */
  id?: number
  /** Category */
  category: number
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /**
   * Slug
   * @format slug
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug?: string
  /**
   * Description
   * @minLength 1
   */
  description: string
  /**
   * Price
   * @format decimal
   */
  price: string
  /**
   * Sell price
   * @format decimal
   */
  sell_price: string
  /** On sell */
  on_sell?: boolean
  /**
   * Stock
   * @min 0
   * @max 4294967295
   */
  stock: number
  /**
   * Image
   * @format uri
   */
  image?: string | null
  /**
   * Created at
   * @format date-time
   */
  created_at?: string
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string
}

export interface Review {
  /** ID */
  id?: number
  /** Product */
  product: number
  /** User */
  user?: number
  /**
   * Rating
   * @min 0
   * @max 4294967295
   */
  rating: number
  /** Comment */
  comment?: string
  /**
   * Created at
   * @format date-time
   */
  created_at?: string
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string
}

export interface UserProfile {
  /** ID */
  id?: number
  /** User */
  user?: number
  /**
   * First name
   * @maxLength 30
   */
  first_name?: string
  /**
   * Last name
   * @maxLength 30
   */
  last_name?: string
  /** Bio */
  bio?: string
  /**
   * Profile picture
   * @format uri
   */
  profile_picture?: string | null
  /**
   * Phone number
   * @maxLength 15
   */
  phone_number?: string
  /** Address */
  address?: string
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://127.0.0.1:8000/api'
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
        },
        signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
      }
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title E-Commerce API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000/api
 * @contact <nhan.nguyenvan@paradox.ai>
 *
 * API documentation for E-Commerce project
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthChangePasswordUpdate
     * @request PUT:/auth/change-password/
     * @secure
     */
    authChangePasswordUpdate: (data: ChangePassword, params: RequestParams = {}) =>
      this.request<ChangePassword, any>({
        path: `/auth/change-password/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthChangePasswordPartialUpdate
     * @request PATCH:/auth/change-password/
     * @secure
     */
    authChangePasswordPartialUpdate: (data: ChangePassword, params: RequestParams = {}) =>
      this.request<ChangePassword, any>({
        path: `/auth/change-password/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthLoginCreate
     * @request POST:/auth/login/
     * @secure
     */
    authLoginCreate: (data: Login, params: RequestParams = {}) =>
      this.request<Login, any>({
        path: `/auth/login/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthLogoutCreate
     * @request POST:/auth/logout/
     * @secure
     */
    authLogoutCreate: (data: Logout, params: RequestParams = {}) =>
      this.request<Logout, any>({
        path: `/auth/logout/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthRegisterCreate
     * @request POST:/auth/register/
     * @secure
     */
    authRegisterCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/register/`,
        method: 'POST',
        secure: true,
        ...params
      }),

    /**
     * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
     *
     * @tags auth
     * @name AuthTokenRefreshCreate
     * @request POST:/auth/token/refresh/
     * @secure
     */
    authTokenRefreshCreate: (data: TokenRefresh, params: RequestParams = {}) =>
      this.request<TokenRefresh, any>({
        path: `/auth/token/refresh/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      })
  }
  carts = {
    /**
     * No description
     *
     * @tags Cart
     * @name CartsList
     * @request GET:/carts/
     * @secure
     */
    cartsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/carts/`,
        method: 'GET',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Cart
     * @name CartsAddCreate
     * @request POST:/carts/add/
     * @secure
     */
    cartsAddCreate: (data: AddToCart, params: RequestParams = {}) =>
      this.request<AddToCart, any>({
        path: `/carts/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Cart
     * @name CartsRemoveDelete
     * @request DELETE:/carts/remove/{product_id}/
     * @secure
     */
    cartsRemoveDelete: (productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/carts/remove/${productId}/`,
        method: 'DELETE',
        secure: true,
        ...params
      })
  }
  orders = {
    /**
     * No description
     *
     * @tags Order
     * @name OrdersList
     * @request GET:/orders/
     * @secure
     */
    ordersList: (params: RequestParams = {}) =>
      this.request<Order[], any>({
        path: `/orders/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersCreate
     * @request POST:/orders/
     * @secure
     */
    ordersCreate: (data: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/orders/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersRead
     * @request GET:/orders/{id}/
     * @secure
     */
    ordersRead: (id: number, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/orders/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersUpdate
     * @request PUT:/orders/{id}/
     * @secure
     */
    ordersUpdate: (id: number, data: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/orders/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersPartialUpdate
     * @request PATCH:/orders/{id}/
     * @secure
     */
    ordersPartialUpdate: (id: number, data: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/orders/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersDelete
     * @request DELETE:/orders/{id}/
     * @secure
     */
    ordersDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersAddCreate
     * @request POST:/orders/{order_id}/add/
     * @secure
     */
    ordersAddCreate: (orderId: string, data: AddOrderItem, params: RequestParams = {}) =>
      this.request<AddOrderItem, any>({
        path: `/orders/${orderId}/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersRemoveDelete
     * @request DELETE:/orders/{order_id}/remove/{product_id}
     * @secure
     */
    ordersRemoveDelete: (orderId: string, productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders/${orderId}/remove/${productId}`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrdersUpdateStatusCreate
     * @request POST:/orders/{order_id}/update-status/
     * @secure
     */
    ordersUpdateStatusCreate: (
      orderId: string,
      data: OrderStatusUpdate,
      params: RequestParams = {}
    ) =>
      this.request<OrderStatusUpdate, any>({
        path: `/orders/${orderId}/update-status/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      })
  }
  products = {
    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesList
     * @request GET:/products/categories/
     * @secure
     */
    productsCategoriesList: (params: RequestParams = {}) =>
      this.request<Category[], any>({
        path: `/products/categories/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesCreate
     * @request POST:/products/categories/
     * @secure
     */
    productsCategoriesCreate: (data: Category, params: RequestParams = {}) =>
      this.request<Category, any>({
        path: `/products/categories/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesSlugRead
     * @request GET:/products/categories/slug/{slug}/
     * @secure
     */
    productsCategoriesSlugRead: (slug: string, params: RequestParams = {}) =>
      this.request<Category, any>({
        path: `/products/categories/slug/${slug}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesRead
     * @request GET:/products/categories/{id}/
     * @secure
     */
    productsCategoriesRead: (id: number, params: RequestParams = {}) =>
      this.request<Category, any>({
        path: `/products/categories/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesUpdate
     * @request PUT:/products/categories/{id}/
     * @secure
     */
    productsCategoriesUpdate: (id: number, data: Category, params: RequestParams = {}) =>
      this.request<Category, any>({
        path: `/products/categories/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesPartialUpdate
     * @request PATCH:/products/categories/{id}/
     * @secure
     */
    productsCategoriesPartialUpdate: (id: number, data: Category, params: RequestParams = {}) =>
      this.request<Category, any>({
        path: `/products/categories/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name ProductsCategoriesDelete
     * @request DELETE:/products/categories/{id}/
     * @secure
     */
    productsCategoriesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products/categories/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsList
     * @request GET:/products/products/
     * @secure
     */
    productsProductsList: (params: RequestParams = {}) =>
      this.request<Product[], any>({
        path: `/products/products/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsCreate
     * @request POST:/products/products/
     * @secure
     */
    productsProductsCreate: (data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/products/products/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsSlugRead
     * @request GET:/products/products/slug/{slug}/
     * @secure
     */
    productsProductsSlugRead: (slug: string, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/products/products/slug/${slug}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsRead
     * @request GET:/products/products/{id}/
     * @secure
     */
    productsProductsRead: (id: number, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/products/products/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsUpdate
     * @request PUT:/products/products/{id}/
     * @secure
     */
    productsProductsUpdate: (id: number, data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/products/products/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsPartialUpdate
     * @request PATCH:/products/products/{id}/
     * @secure
     */
    productsProductsPartialUpdate: (id: number, data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/products/products/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Products
     * @name ProductsProductsDelete
     * @request DELETE:/products/products/{id}/
     * @secure
     */
    productsProductsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products/products/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Review
     * @name ProductsProductsReviewsList
     * @request GET:/products/products/{product_id}/reviews/
     * @secure
     */
    productsProductsReviewsList: (productId: string, params: RequestParams = {}) =>
      this.request<Review[], any>({
        path: `/products/products/${productId}/reviews/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Review
     * @name ProductsReviewsCreate
     * @request POST:/products/reviews/
     * @secure
     */
    productsReviewsCreate: (data: Review, params: RequestParams = {}) =>
      this.request<Review, any>({
        path: `/products/reviews/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      })
  }
  users = {
    /**
     * No description
     *
     * @tags User
     * @name UsersProfileRead
     * @request GET:/users/profile/
     * @secure
     */
    usersProfileRead: (params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/profile/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags User
     * @name UsersProfileUpdate
     * @request PUT:/users/profile/
     * @secure
     */
    usersProfileUpdate: (data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/profile/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags User
     * @name UsersProfilePartialUpdate
     * @request PATCH:/users/profile/
     * @secure
     */
    usersProfilePartialUpdate: (data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/profile/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params
      })
  }
}