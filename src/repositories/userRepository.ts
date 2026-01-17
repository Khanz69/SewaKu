import { apiClient } from "@/src/api/apiClient";
import type { CreateUserPayload, User } from "@/src/types/user";
import type { LocalImageAsset } from "@/src/utils/productRequest";
import { isLocalImageAsset } from "@/src/utils/productRequest";

const RESOURCE = "/user";

type RawApiUser = {
  id: string;
  created_at: number | string;
  full_name: string;
  phone: number;
  email: string;
  password_hash: string;
  avatar?: string;
};

const mapApiUser = (apiUser: RawApiUser): User => ({
  id: apiUser.id,
  createdAt:
    typeof apiUser.created_at === "number"
      ? apiUser.created_at
      : Date.parse(String(apiUser.created_at)) || Date.now(),
  fullName: apiUser.full_name,
  phone: Number(apiUser.phone) || 0,
  email: apiUser.email,
  avatar: apiUser.avatar,
  passwordHash: apiUser.password_hash,
});

const toApiPayload = (payload: CreateUserPayload) => ({
  full_name: payload.fullName,
  phone: payload.phone,
  email: payload.email,
  password_hash: payload.password,
  created_at: new Date().toISOString(),
});

const imageToJsonValue = (image: LocalImageAsset) =>
  image.base64 ? `data:${image.type ?? "image/jpeg"};base64,${image.base64}` : image.uri;

const buildAvatarRequestBody = (avatar: string | LocalImageAsset) => {
  const value = isLocalImageAsset(avatar) ? imageToJsonValue(avatar) : avatar;
  return {
    body: { avatar: value },
    headers: { "Content-Type": "application/json" },
  };
};

type CreateUserResponse = {
  user: RawApiUser;
};


export const userRepository = {
  async create(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<CreateUserResponse | RawApiUser>(
      RESOURCE,
      toApiPayload(payload)
    );
    const data = response.data as CreateUserResponse | RawApiUser;
    const apiUser = "user" in data ? data.user : data;
    if (!apiUser || !apiUser.id) {
      throw new Error("Invalid user response from API");
    }
    return mapApiUser(apiUser);
  },

  async findByEmail(email: string): Promise<User | null> {
    const response = await apiClient.get<RawApiUser[]>(RESOURCE, {
      params: { email },
    });
    if (!response.data.length) {
      return null;
    }
    const normalized = email.trim().toLowerCase();
    const matched = response.data.find(
      (user) => user.email?.trim().toLowerCase() === normalized
    );
    if (!matched) {
      return null;
    }

    return mapApiUser(matched);
  },

  async getById(id: string): Promise<User> {
    const response = await apiClient.get<RawApiUser>(`${RESOURCE}/${id}`);
    return mapApiUser(response.data);
  },

  async findByFullName(fullName: string): Promise<User | null> {
    const response = await apiClient.get<RawApiUser[]>(RESOURCE, {
      params: { full_name: fullName },
    });
    if (!response.data.length) {
      return null;
    }
    const normalized = fullName.trim().toLowerCase();
    const matched = response.data.find(
      (user) => user.full_name?.trim().toLowerCase() === normalized
    );
    if (!matched) {
      return null;
    }

    return mapApiUser(matched);
  },

  async updateAvatar(id: string, avatar: string | LocalImageAsset): Promise<User> {
    const { body, headers } = buildAvatarRequestBody(avatar);
    const config = headers ? { headers } : undefined;
    try {
      const response = await apiClient.patch<CreateUserResponse | RawApiUser>(
        `${RESOURCE}/${id}`,
        body,
        config
      );
      const data = response.data as CreateUserResponse | RawApiUser;
      const apiUser = "user" in data ? data.user : data;
      if (!apiUser || !apiUser.id) {
        throw new Error("Invalid user response from API");
      }
      const mapped = mapApiUser(apiUser);
      const refreshed = await userRepository.getById(id);
      if (!refreshed.avatar) {
        throw new Error("Avatar not saved");
      }
      return refreshed.avatar ? refreshed : mapped;
    } catch {
      const response = await apiClient.put<CreateUserResponse | RawApiUser>(
        `${RESOURCE}/${id}`,
        body,
        config
      );
      const data = response.data as CreateUserResponse | RawApiUser;
      const apiUser = "user" in data ? data.user : data;
      if (!apiUser || !apiUser.id) {
        throw new Error("Invalid user response from API");
      }
      const mapped = mapApiUser(apiUser);
      const refreshed = await userRepository.getById(id);
      if (!refreshed.avatar) {
        throw new Error("Avatar not saved");
      }
      return refreshed.avatar ? refreshed : mapped;
    }
  },


  async authenticate(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await apiClient.get<RawApiUser[]>(RESOURCE, {
      params: { email: normalizedEmail },
    });
    if (!response.data.length) {
      throw new Error("User not found");
    }

    const match = response.data.find((record) =>
      userRepository.verifyPassword(password, record.password_hash)
    );
    if (!match) {
      throw new Error("Invalid password");
    }

    return mapApiUser(match);
  },

  verifyPassword(inputPassword: string, hash: string): boolean {
    return inputPassword === hash;
  },
};
